---
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🗃️ SealedKommons

A modern, KSP-based alternative to [sealed-enum](https://github.com/livefront/sealed-enum){target="_blank"} for Kotlin Multiplatform. 
It's not as feature-rich as sealed-enum yet, but it contains the most important part: **generating a list of entries**.

## 🎯 Supported Targets

The following targets are supported:

| Platform           | Targets                                       |
|:-------------------|:----------------------------------------------|
| **JVM & Android**  | `jvm`, `android`                              |
| **Apple**          | `ios`, `macos`, `tvos`, `watchos`             |
| **Web**            | `js`, `wasmJs`                                |
| **Native & Other** | `androidNative`, `linux`, `mingw`, `wasmWasi` |

## 🚀 Installation

Integration using Version Catalog is highly recommended for aligned version usage.

=== "Version Catalog"

    First declare the library in your Version Catalog:

    ```toml
    [libraries]
    kommons-sealed = { group = "dev.datlag.kommons", name = "sealed", version.ref = "kommons" }
    kommons-sealed-processor = { group = "dev.datlag.kommons", name = "sealed-processor", version.ref = "kommons" }
    ```
    
    Then add the dependency to your module:
    
    ```kotlin
    plugins {
        alias(libs.plugins.ksp)
    }
    
    dependencies {
        implementation(libs.kommons.sealed)
        add("kspCommonMainKotlinMetadata", libs.kommons.sealed.processor)
    }
    ```

=== "Gradle"

    Simply add the dependency like this:

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    
    dependencies {
        implementation("dev.datlag.kommons:sealed:<version>")
        add("kspCommonMainKotlinMetadata", "dev.datlag.kommons:sealed-processor:<version>")
    }
    ```

## 🛠️ Usage

Simply annotate your sealed class or sealed interface with `@SealedKommons` and make sure to create a `companion object` for it.

```kotlin
@SealedKommons
sealed interface MySealedInterface {
    object A : MySealedInterface
    data object B : MySealedInterface
    
    sealed interface C : MySealedInterface {
        object D : C
    }
    
    companion object
}
```

You can now use the generated list of entries which contains all `objects` or `data objects` of this sealed interface or it's subtypes:

```kotlin
val entries = MySealedInterface.entries
```

The entries variable looks like this under the hood:

```kotlin
val entries = listOf(MySealedInterface.A, MySealedInterface.B, MySealedInterface.C.D)
```
