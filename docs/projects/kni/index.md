---
title: "Kotlin Native Interface (KNI)"
description: "Unify Java Native Interface (JNI) development across Android, MacOS, Linux, and Windows with a powerful Kotlin library abstracting C-pointers and boilerplate."
icon: octicons/plug-24
tags:
  - Android
  - MacOS
  - Linux
  - Windows
---

# 🧩 Kotlin Native Interface (KNI)

A powerful Kotlin Multiplatform library designed to simplify and unify JNI (Java Native Interface) development across Android, MacOS, Linux, and Windows platforms.

## The Challenge of JNI in Kotlin Multiplatform

Writing native bridging code between the JVM and native targets (like C++ or Kotlin/Native) is notoriously verbose and error-prone. Developers are forced to deal with raw C-pointers, memory allocation, explicit garbage collection pinning, and platform-specific variations of the JNI environment.

The Kotlin Native Interface (KNI) solves this by abstracting the heavy lifting. Instead of writing boilerplate C-interop code to safely extract a string or map an array, KNI provides a unified, highly optimized runtime library. It allows you to write common JNI code once for `androidNative`, `linux`, `macos`, and `windows` targets, featuring a rich set of extension functions to effortlessly convert between raw JNI types and standard Kotlin types.

## 🚀 Installation

Integration using a Version Catalog is highly recommended to ensure aligned version usage across your multiplatform project.

```toml
[libraries]
kommons-kni = { group = "dev.datlag.kommons", name = "kni", version.ref = "kni" }
```

Then, add the dependency to your native source sets in `build.gradle.kts`:

```kotlin
kotlin {
    sourceSets {
        val nativeMain by getting {
            dependencies {
                implementation(libs.kommons.kni)
            }
        }
    }
}
```

## 📝 String Encoding & Conversion

One of the most frequent operations in JNI is passing strings between the JVM and native code. However, string handling is also one of the most common sources of memory leaks and corrupted characters.

The JVM uses a modified UTF-16 format internally, while native environments usually expect standard UTF-8 C-strings. KNI handles memory scoping and pointer conversions safely via the `Encoding` interface, providing built-in, zero-allocation wrappers for both `UTF8` and `UTF16`.

### Converting JNI Strings to Kotlin

When your native code receives a `jstring` from Java, you cannot read it directly. You must extract its characters using the `JNIEnv` pointer, and crucially, you must release those characters when you are done to prevent a memory leak.

KNI simplifies this entirely into a single `.toKString()` extension function. By default, this uses standard `Encoding.UTF8`, safely extracting the characters, copying them into a native Kotlin `String`, and cleaning up the JNI references automatically.

```kotlin
@CName("Java_your_package_name_ClassName_printMessage")
fun printMessage(env: CPointer<JNIEnvVar>, clazz: jobject, message: jstring) {
    // Safely extracts UTF-8 characters, creates a String, and releases JNI memory
    val kotlinString: String? = message.toKString(env)

    // If you need UTF-16 specifically, you can pass the encoding explicitly:
    // val utf16String = message.toKString(env, Encoding.UTF16)

    if (kotlinString != null) {
        println("Message from Java: $kotlinString")
    }
}
```

### Converting Kotlin Strings to JNI

Conversely, returning a string from native code back to the JVM requires allocating a new `jstring` on the JVM heap. The `.toJString()` extension ensures this allocation happens safely within the current JNI memory scope.

```kotlin
@CName("Java_your_package_name_ClassName_getGreeting")
fun getGreeting(env: CPointer<JNIEnvVar>, clazz: jobject): jstring? {
    val greeting = "Hello from Kotlin/Native!"
    
    // Allocates a new jstring on the JVM heap safely
    return greeting.toJString(env)
}
```

## 🔍 Future Roadmap: Auto-Conversion and KSP

If you used `Native-Kommons` prior to this modular rewrite, you might be looking for the `@JNIConnect` annotation used to automatically generate JVM-to-Native bindings via KSP.

This code-generation feature is currently unavailable in the new KNI library, but it is a major part of our roadmap. Our initial focus was rewriting the runtime library to ensure common operations are rock-solid and consistent across all desktop and mobile platforms. Now that the core bridging is stable, we are actively researching an improved, type-safe code generation approach.