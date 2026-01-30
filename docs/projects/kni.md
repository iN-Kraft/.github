---
tags:
  - Android
  - MacOS
  - Linux
  - Windows
---

# 🧩 Kotlin Native Interface

A powerful Kotlin Multiplatform library designed to simplify and unify JNI (Java Native Interface) development across Android, MacOS, Linux and Windows platforms.

## ✨ Features

- **Unified API:** Write common JNI code for `androidNative`, `linux`, `macos` and `windows` targets.
- **Type Conversion:** A rich set of extension functions to effortlessly convert between JNI types and standard Kotlin types (e.g. `jstring.toKString()`, `IntArray.toJIntArray()`).

## 🚀 Installation

Integration using Version Catalog is highly recommended for aligned version usage.

=== "Version Catalog"

    First declare the library in your Version Catalog:

    ```toml
    [libraries]
    kommons-kni = { group = "dev.datlag.kommons", name = "kni", version.ref = "kommons" }
    ```
    
    Then add the dependency to your module:
    
    ```kotlin
    dependencies {
        implementation(libs.kommons.kni)
    }
    ```

=== "Gradle"

    Simply add the dependency like this:

    ```kotlin
    dependencies {
        implementation("dev.datlag.kommons:kni:<version>")
    }
    ```

## 🛠️ Usage

The runtime library provides a set of handy extension functions to make conversions between JNI and Kotlin types trivial.  
Simply import the functions you need and call them on the respective types.
The JNIEnv pointer is required for operations that interact with the JVM.

Your native code can simply look like this:

```kotlin
@CName("Java_your_package_name_ClassName_printMessage")
fun printMessage(env: CPointer<JNIEnvVar>, clazz: jobject, message: jstring) {
    val kotlinString: String? = message.toKString(env)
    
    println("Message from Java: $kotlinString")
}
```

While your JVM binding is implemented like this:

```kotlin
package your.package.name

class ClassName {
    external fun printMessage(message: String)
}
```

## 🔍 What about the KSP auto conversion?

If you used `Native-Kommons` prior you might want to use the `@JNIConnect` annotation to automatically generate the JNI bindings.

This feature is currently not available, but also **NOT FORGOTTEN**.

Our main focus was the runtime library rework to commonize the API even more, to make common operations more straightforward and consistent across different platforms.  
We are working on an even more improved approach to JNI bridging, which takes a lot time to construct.
