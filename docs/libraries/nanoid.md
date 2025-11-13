---
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# NanoId

A Kotlin Multiplatform port of [this JavaScript library](https://github.com/ai/nanoid){target="_blank"}, providing a fast, secure and URL-friendly unique ID generator.

[:fontawesome-brands-github: GitHub Repository](https://github.com/iN-Kraft/NanoId){ .md-button target="_blank" }

## 🎯 Supported Targets

The following targets are supported:

| Platform           | Targets                                  |
|:-------------------|:-----------------------------------------|
| **JVM & Android**  | `jvm`, `android`                         |
| **Apple**          | `ios`, `macos`, `tvos`, `watchos`        |
| **Web**            | `js`, `wasmJs`                           |
| **Native & Other** | `linux`, `mingw`                         |

## ✨ Features

NanoId comes with several features while beeing fully customizable.

### 🔒 Secure

NanoId uses Korlibs [Crypto SecureRandom](https://github.com/korlibs/korlibs-crypto){target="_blank"} to generate cryptographically strong random IDs with a proper distribution of characters.

Crypto provides a `SecureRandom` class that extends the `kotlin.random.Random` class, but generating cryptographic secure values.

- It uses `SecureRandom` on the JVM + `PRNGFixes` on Android.
- On Native POSIX (including Linux, macOS, iOS) it uses `/dev/urandom`
- On Windows `BCryptGenRandom` is in use

### 📦 Compact

NanoId generates compact IDs with just 21 characters.

By using a larger alphabet than UUID, NanoId can generate a greater number of unique IDs, when compared to UUID, with fewer characters (21 vs 36).

### 🖌️ Customizable

NanoId is fully customizable.

All default options may be overridden. Supply your own Random Number Generator, alphabet or size.

## 🚀 Installation

Integration using Version Catalog is highly recommended for aligned version usage.

=== "Version Catalog"

    First declare the library in your Version Catalog:

    ```toml
    [versions]
    inkraft-nanoid = "<version>"

    [libraries]
    inkraft-nanoid = { group = "dev.datlag.inkraft", name = "nanoid", version.ref = "inkraft-nanoid" }
    ```

    Then add the dependency to your module:

    ```kotlin
    dependencies {
        implementation(libs.inkraft.nanoid)
    }
    ```

=== "Gradle"

    Simply add the dependency like this:

    ```kotlin
    dependencies {
        implementation("dev.datlag.inkraft:nanoid:<version>")
    }
    ```

## 🛠️ Usage

Creating a default URL-friendly unique identifier:

```kotlin
val id = NanoId.generate()
```

Customizing the generated output:

```kotlin
val generator = Random()
val alphabet = "0123456789"
val size = 20

val id = NanoId.generate(generator, alphabet, size)
```