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
There is nothing magical about them, it's just a function returning either a result or an error, very mindful, very demure.

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
Control flow suddenly becomes implicit, error paths disappear from function signatures and you're basically dumping the problem on the caller without even warning them that something could blow up.

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
Anything else like invalid input, network failures, parsing errors deserves explicit handling, so that failure paths are visible in the code and the program remains robust.
And the worst part of the approach above? We aren't even required to catch the exceptions, the compiler and IDE might not even tell us to do so.

## No Common Ground

Even within plain Java and Kotlin, there is no consistent approach to error handling, not even in the standard library.
Take `String` as an example: `indexOf` never throws an exception, instead returning a sentinel value like `-1` when the substring isn't found.
But call `substring` with an invalid index, even one obtained from `indexOf`, and it immediately throws an exception, potentially crashing your program.
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

With `Raise` we can basically:

- Be clear about errors: You see exactly what kind of stuff can go wrong
- Keep it clean: Failures just flow through linearly, so we don't end up with that nested `try/catch` hell
- Glue things together: It's way easier to combine different operations that might fail without the code getting messy
- Fix things easily: It just works better with retry policies and actually makes recovery logic make sense

In short, Arrow's approach lets us write failure-aware programs that are both readable and robust, it turns the whole "beast" of error handling into pure beauty :)

```kotlin title="Kotlin with Arrow Superpower"
sealed interface AuthError {
    object Credentials : AuthError
    object Network : AuthError
}

context(_: Raise<AuthError>)
fun signIn(email: String, password: String): String {
    if (password != "pass") {
        raise(AuthError.Credentials)
    }

    val successful: Boolean = service.signIn(email, password)
    if (!successful) {
        raise(AuthError.Network)
    }
    
    return service.username()
}

fun main() {
    val username: Either<AuthError, String> = either {
        signIn("example@mail.com", "password")
    }
    
    when (username) {
        is Either.Left<AuthError> -> {
            // handle error
        }
        is Either.Right<String> -> {
            // got username successfully
        }
    }
}
```

Obviously this example is highly simplified, but it already demonstrates the benefits of explicit error handling.
For the first time, we can clearly see which methods may fail and exactly what kind of errors they can produce.

## Resilience: Retries without losing control

Explicit error handling is cool for local stuff, but it's a lifesaver when things get complicated, like with network requests or services timing out.
In distributed systems, stuff fails all the time.
Instead of patching in `try/catch` everywhere, Arrow lets us model retries as part of the actual flow.

```kotlin title="Kotlin Sign-In with retries"
context(_: Raise<AuthError>)
fun signInWithRetry(email: String, password: String): String {
    return Schedule.exponential<AuthError>(DURATION)
        .and(Schedule.recurs(MAX_RETRIES))
        .jittered()
        .doWhile { e: AuthError, _ -> e.isRetryable() }
        .retryRaise { signIn(email, password) }
        .bind()
}
```

## Use `Raise` for the "expected" stuff

For domain or app-level errors, like: bad input, authentication failures, network errors, parsing issues etc. you should go with `Raise` (or other explicit models).
These are things your app knows will happen eventually, so you need to handle them properly.

## Keep Exceptions for when things "explode"

Exceptions should only be for the really bad stuff, like what I mentioned before: out-of-memory errors, JVM shutdown, job or thread cancellations.
Also for bugs where you clearly broke an internal invariant.
You can't really recover from these in a useful way, so they shouldn't be part of your normal logic anyway.

**Always remember:** The moment a failure is expected, it stops being exceptional and that is where explicit error handling shines.
