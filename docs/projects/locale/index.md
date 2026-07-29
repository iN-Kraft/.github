---
title: "Locale for Kotlin Multiplatform"
description: "A robust, type-safe drop-in replacement for java.util.Locale that perfectly mirrors the Java API while embracing modern Kotlin multiplatform capabilities."
icon: octicons/globe-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🌍 Locale

A robust, type-safe, and fully multiplatform replacement for `java.util.Locale`.

When migrating a JVM application to Kotlin Multiplatform (KMP), one of the most immediate hurdles developers face is the absence of `java.util.Locale` on iOS, Web, and Desktop targets. This creates massive friction when handling internationalization (i18n), formatting dates, or negotiating content with a backend server.

Our Locale module solves this by providing a unified, drop-in replacement that perfectly mirrors the familiar Java API while embracing modern Kotlin features like value classes and multiplatform expected declarations.

## 🎯 Supported Targets

The following targets are supported:

| Platform           | Targets                                       |
|:-------------------|:----------------------------------------------|
| **JVM & Android**  | `jvm`, `android`                              |
| **Apple**          | `ios`, `macos`, `tvos`, `watchos`             |
| **Web**            | `js`, `wasmJs`                                |
| **Native & Other** | `androidNative`, `linux`, `mingw`, `wasmWasi` |

## ✨ Core Philosophy

Unlike lightweight multiplatform alternatives that only wrap a simple language string, this library provides a deeply structured representation of a user's locale, including full ISO 3166-1 geographical mapping, script variations, and platform-specific resolution.

- **JVM Familiarity:** Includes standard constants like `Locale.US` and `Locale.ENGLISH` so your existing business logic won't break during a KMP migration.
- **Platform Resolution:** Automatically detects the user's system locale via `expect/actual` implementations across Android, iOS, Windows, Linux (POSIX), JS, and WASM.
- **BCP 47 Support:** Full support for parsing standard IETF BCP 47 language tags (e.g., `zh-Hant-TW`).

## 🚀 Installation

Integration using a Version Catalog is highly recommended to ensure aligned version usage across your multiplatform project.

```toml
[libraries]
kommons-locale = { group = "dev.datlag.kommons", name = "locale", version.ref = "locale" }
```

Then, add the dependency to your common source set in `build.gradle.kts`:

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.kommons.locale)
            }
        }
    }
}
```

## 🛠️ Instantiation & Parsing

The library provides multiple flexible ways to instantiate a Locale depending on where your data is coming from.

### System Default

If you need to format UI elements based on the device's current settings, you can fetch the system default locale. The library utilizes platform-specific APIs (like the Browser Navigator for Web or POSIX environment variables for Native) under the hood.

```kotlin
val currentLocale: Locale? = Locale()

if (currentLocale != null) {
    println("User speaks: ${currentLocale.language}")
}
```

### Parsing Language Tags

When communicating with REST APIs, you will often receive `Accept-Language` headers or JSON payloads containing standard language tags. You can parse these safely using `forLanguageTag`.

```kotlin
// Parses standard IETF BCP 47 tags
val parsed = Locale.forLanguageTag("de-DE")

println(parsed?.language) // Output: "de"
println(parsed?.country?.codeAlpha2) // Output: "DE"
```

### Using Standard Constants

If you are hardcoding fallback locales or migrating legacy JVM code, you can use the built-in companion constants. These are clearly separated into **Language Only** (e.g., English generally) and **Language + Region** (e.g., United States English).

```kotlin
// Matches just the language ("en")
val baseLanguage = Locale.ENGLISH 

// Matches the language + formatting rules for the USA ("en-US")
val regionalLanguage = Locale.US 
```

## 🌉 Platform Interoperability

While Native-Kommons Locale acts as your primary, shared data structure in `commonMain`, you will inevitably need to interact with platform-specific APIs (like Android's `java.text.SimpleDateFormat` or Apple's `NSDateFormatter`).

To make this seamless, the library provides zero-friction, two-way conversion extensions for both the JVM and Apple platforms.

### JVM Interoperability (`java.util.Locale`)

You can effortlessly jump between a Native-Kommons Locale and a traditional Java Locale.

```kotlin
// 1. Converting Native-Kommons -> Java
val kommonsLocale = Locale.GERMANY
val javaLocale: java.util.Locale = kommonsLocale.asJavaLocale()

// 2. Converting Java -> Native-Kommons
val systemJavaLocale = java.util.Locale.getDefault()
val backToKommons = Locale(systemJavaLocale)
```

### Apple Interoperability (`NSLocale`)

When working in `iosMain`, `macosMain` or any other apple target, you can map directly to Apple's Foundation framework.

```kotlin
// 1. Converting Native-Kommons -> Apple
val myLocale = Locale.FRANCE
val nsLocale: NSLocale = myLocale.asAppleLocale()

// 2. Converting Apple -> Native-Kommons
val currentNsLocale = NSLocale.autoupdatingCurrentLocale
val kmpLocale = Locale(currentNsLocale)
```