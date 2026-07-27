---
icon: octicons/list-ordered-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🗃️ Shadow-Enum

A modern, Kotlin Symbol Processor (KSP) based alternative to older reflection-heavy libraries (like Livefront's [sealed-enum](https://github.com/livefront/sealed-enum){target="_blank"}). It brings true `enum`-like capabilities (`entries`, `valueOf`, `name`, and `ordinal`) to `sealed` classes and interfaces across all Kotlin Multiplatform targets.

## 🎯 Supported Targets

The following targets are supported:

| Platform           | Targets                                       |
|:-------------------|:----------------------------------------------|
| **JVM & Android**  | `jvm`, `android`                              |
| **Apple**          | `ios`, `macos`, `tvos`, `watchos`             |
| **Web**            | `js`, `wasmJs`                                |
| **Native & Other** | `androidNative`, `linux`, `mingw`, `wasmWasi` |

## The Problem with Enums and Sealed Classes

In modern Kotlin development, developers are often forced to choose between two imperfect structures:

1. `enum class`: Provides fantastic built-in utilities (`.entries`, `.name`, and string parsing via `valueOf()`), but cannot hold dynamic state. Every enum constant is a rigid singleton.
2. `sealed interface` / `sealed class`: Allows for rich, mixed hierarchies where `data object` singletons can exist alongside `data class` instances holding state. However, sealed classes have zero built-in iterative capabilities. You cannot easily get a list of all objects, parse them from a string, or get their ordinal position without resorting to heavy Reflection.

Because Kotlin Reflection (`kotlin-reflect`) causes massive binary bloat on Android and completely breaks on Kotlin/Native and Kotlin/Wasm, multiplatform developers are left without a solution.

**ShadowEnum** solves this by using KSP at compile time to generate the missing bridging code with absolutely zero runtime reflection.

## 🚀 Installation

Integration using Version Catalog is highly recommended for aligned version usage.

```toml
    [libraries]
kommons-shadow-enum = { group = "dev.datlag.kommons", name = "shadow-enum", version.ref = "shadow-enum" }
kommons-shadow-enum-processor = { group = "dev.datlag.kommons", name = "shadow-enum-processor", version.ref = "shadow-enum" }
```

Then add the dependency to your module:

```kotlin
    plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    implementation(libs.kommons.shadow.enum)
    add("kspCommonMainKotlinMetadata", libs.kommons.shadow.enum.processor)
}
```

## 🛠️ Usage and the "Shadow Enum" Architecture

To use the library, simply apply the `@EnumShadow` annotation to any sealed interface or class. You **should** also define an `companion object`, which serves as the anchor point for the generated extension functions.

```kotlin
@EnumShadow
sealed interface AppTheme {
    data object Light : AppTheme
    data object Dark : AppTheme

    companion object
}
```

### The Generated Output

At compile time, the KSP plugin generates a standalone registry object (e.g., `AppThemeShadowEnum`) that implements the `ShadowEnum<T>` interface. It also attaches convenient extensions to your companion object.

This allows you to interact with your sealed class exactly as if it were a standard Kotlin enum:

```kotlin
fun main() {
    // 1. Iterate over all object entries
    AppTheme.entries.forEach { theme ->
        println("Theme ${theme.name()} is at index ${theme.ordinal()}")
    }
    
    // 2. Safe String Parsing (A feature missing from standard enums!)
    val fromApi: AppTheme? = AppTheme.valueOfOrNull("Light")
    
    // 3. Strict String Parsing
    val strictApi: AppTheme = AppTheme.valueOf("Dark")
}
```

## 🎛️ Advanced: Handling Mixed Hierarchies

The primary reason developers use sealed classes over standard enums is to mix static singletons with dynamic state.

The `ShadowEnum` processor natively understands this and categorizes your hierarchy intelligently:

```kotlin
@EnumShadow
sealed interface NetworkResult {
    data object Loading : NetworkResult
    data class Success(val json: String) : NetworkResult // <-- Has State!
    
    companion object
}
```

If you query the generated `ShadowEnum` object, it handles this mixed state safely:

- `entries`: This list will only contain the `Loading` object. Data classes are intentionally excluded from `entries` because they are not singletons.
- `classes`: This list contains the `KClass` references for all children (both `Loading` and `Success`).
- `ordinalOf()`: Calling this on `Loading` returns `0`. Calling this on a `Success` instance safely returns `-1`. 
- `nameOf()`: Calling this on `Loading` returns `"Loading"`. Calling it on a `Success` instance elegantly falls back to its simple class name `"Success"`.

## 🗂️ Advanced: Nested Naming Convention

When structuring large sealed hierarchies, developers often nest objects inside other sealed interfaces.

By default, the `@EnumShadow` annotation uses a dot (`.`) as a `nestedSeparator`. When the KSP plugin generates the name for a nested object, it automatically concatenates the parent names.

```kotlin
@EnumShadow(nestedSeparator = '/')
sealed interface Route {
    sealed interface Auth : Route {
        data object Login : Auth
    }
    companion object
}

```

In the example above, calling `Route.valueOf("Auth/Login")` will correctly parse the nested string and return the `Login` object. You can even use the vararg convenience method: `Route.valueOf("Auth", "Login")`.
