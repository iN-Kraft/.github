# Beauty and Beast of Kotlin Error Handling

!!! info "Preamble"

    I've always disliked it when Kotlin is described as "modern Java".
    While Kotlin started on the JVM, reducing it to nicer syntax for Java ignores what it has grown into: a language with its own philosophy, a strong type system and first-class support for building correct and expressive programs across multiple platforms.

    Still, many of the problems Kotlin developers face today, especially around error handling, come straight from the JVM world.

We all know that error handling is one of **if not the** most essential parts of programming, because it defines what our application can actually handle and where it simply gives up.

## TL;DR

This article is really worth reading to truly understand error handling, however the most important part to internalize:

**The moment a failure is expected, it stops being exceptional and that is where explicit error handling shines.**

## Exception Misconceptions

The thing I never understood about Java, Kotlin and many other languages is their reliance on exceptions.
In my experience, expcetions often exist because of error handling misconception.

It's worth looking at how Go approaches error handling.
Go treats errors as ordinary values: they are explicit, visible and impossible to ignore without doing so deliberately.
There is nothing magical about them, no hidden control flow, just a function returning either a result or an error, very mindful, very demure.

```go title="Go"
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("Error: ", err)
        return
    }
    fmt.Println("Result: ", result)
}
```

Now compare this to Kotlin, where failure is frequently expressed through exceptions.
Control flow suddenly becomes implicit, error paths disappear from function signatures and the responsibility for handling failure is silently pushed to the caller, often without any indication that something can go wrong at all.

```kotlin title="Kotlin"
fun divide(a: Int, b: Int): Int {
    if (b == 0) throw IllegalArgumentException("division by zero")
    return a / b
}

fun main() {
    try {
        val result = divide(10, 0)
        println("Result: $result")
    } catch (e: IllegalArgumentException) {
        println("Error: ${e.message}")
    }
}
```

### Tell me why?

So what's wrong about it, aren't we handling errors here properly?  
Our goal as developers is not to let applications crash in the worst case, it's to handle failures explicitly and predictably.
Exceptions should be reserved for truly _exceptional_ situations: out-of-memory errors, JVM shutdowns, or job and thread cancellations.
Anything else - invalid input, network failures, parsing errors - deserves explicit handling, so that failure paths are visible in the code and the program remains robust.
And the worst part of the approach above? We aren't even required to catch the exceptions, the compiler and IDE might not even tell us to do so.

## No Common Ground

Even within plain Java and Kotlin, there is no consistent approach to error handling, not even in the standard library.
Take `String` as an example: `indexOf` never throws an exception, instead returning a sentinel value like `-1` when the substring isn't found.
But call `substring` with an invalid index - even one obtained from `indexOf` - and it immediately throws an exception, potentially crashing your program.
This inconsistency forces developers to constantly check documentation, guess intentions or write defensive code everywhere, which is exactly the problem explicit error handling aims to solve.

```kotlin title="Kotlin"
fun parse(value: String): String {
    val index: Int = value.indexOf("abc") // Does not throw
    return value.substring(index) // Throws
}

fun main() {
    println(parse("Hello World!"))
}
```

## Arrow: Explicit, Composable Error Handling

After seeing how inconsitent and fragile traditional exception-based error handling can be, it's clear that we need something more predictable and composable.
That's where **Arrow** comes in. With it's `Raise` API, Kotlin finally allows us to express failures as first-class, typed values, rather than relying on hidden control flow.

`Raise` gives us the ability to:

- Explicitly declare the errors a function can produce
- Propagate failures linearly, without nested `try/catch` blocks
- Compose error-prone operations seamlessly
- Integrate with retry policies and structure recovery

In short, Arrow's approach lets us write failure-aware programs that are both readable and robust, turning what was once a "beast" into something truly beautyful.

```kotlin title="Kotlin with Arrow Superpower"
sealed interface AuthError {
    object Credentials : AuthError
    object Network : AuthError
}

context(_: Raise<AuthError>)
fun signIn(username: String, password: String): String {
    if (password != "pass") {
        raise(AuthError.Credentials)
    }

    val successful: Boolean = service.signIn(username, password)
    if (!successful) {
        raise(AuthError.Network)
    }
    
    return service.username()
}

fun main() {
    val username: String = recover({
        signIn("user", "pass")
    }) { e: AuthError ->
        val message = when (e) {
            AuthError.Credentials -> "Invalid Credentials"
            AuthError.Network -> "Network Issue"
        }

        println(message)
    }
}
```

Obviously this example is highly simplified, but it already demonstrates the benefits of explicit error handling.
For the first time, we can clearly see which methods may fail and exactly what kind of errors they can produce.

## Resilience: Retries without losing control

Explicit error handling becomes especially valuable once failures stop being purely local.
Network requests fail, services time out and transient errors are simply part of running distributed systems.
In exception-based code, retry logic is often bolted on afterwards using `try/catch` blocks, making control flow harder to follow and error handling even more implicit.
Arrow takes a different approach: retries are modeled explicitly and remain part of the same typed error flow.

```kotlin title="Kotlin Sign-In with retries"
context(_: Raise<AuthError>)
fun signInWithRetry(username: String, password: String): String {
    return Schedule.exponential<AuthError>(DURATION)
        .and(Schedule.recurs(MAX_RETRIES))
        .jittered()
        .doWhile { e: AuthError, _ -> e.isRetryable() }
        .retryRaise { signIn(username, password) }
        .bind()
}
```

## When to use `Raise` and when not to

Not every failure should be modeled the same way and Arrow is not a replacement for every exception in the JVM.
The key distinction is whether a failure is part of the programs expected behavior or a fundamental breakdown of the runtime.

Use `Raise` (or other explicit error models) for domain and application-level failures: invalid input, authentication failures, network errors, parsing issues or any situation the application is expected to encounter and handle gracefully.
These failures should be visible in the code, typed and composable - exactly what `Raise` is designed for.

Exceptions, on the other hand, should be reserved for truly exceptional situations, like mentioned earlier: out-of-memory errors, JVM shutdown, job or thread cancellation or violations of internal invariants that indicate a programming bug.
These are not recoverable in a meaningful way and should not be part of an applications normal control flow.

**Always remember:** The moment a failure is expected, it stops being exceptional and that is where explicit error handling shines.

## Conclusion

Error handling is not a secondary concern or an implementation detail, it is a core part of application design.
The way a language models failure directly influences how predictable, testable and resilient our systems become.

On the JVM, exception-based error handling has long been the default, but as we've seen, it often hides control flow, encourages inconsistency and makes failures harder to reason about.

Kotlin gives us better tools than Java ever had, but real clarity only emerges when failures are treated as first-class values.
Arrows `Raise` API demonstrates that explicit, typed error handling does not have to come at the cost of readability or ergonomics.

The "beast" of error handling isn't failure itself, but ambiguity.
Once failures are made explicit, predictable and intentional, they stop being something to fear and become just another part of the programs logic - something we can reason about, test and improve.