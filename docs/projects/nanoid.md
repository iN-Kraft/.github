---
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🎲 NanoId

A Kotlin Multiplatform port of [this JavaScript library](https://github.com/ai/nanoid){target="_blank"}, providing a fast, secure and URL-friendly unique ID generator.

[:fontawesome-brands-github: GitHub Repository](https://github.com/iN-Kraft/NanoId){ .md-button target="_blank" }

## 💡 Why NanoId?

In modern software development, generating unique identifiers is a foundational requirement. Whether you are assigning IDs to entities in a database, tracking user sessions, or naming temporary files, uniqueness and predictability are critical concerns. While UUIDs (Universally Unique Identifiers) have long been the industry standard, they are often excessively long and inefficient, especially in scenarios where storage space and URL safety are paramount.

NanoId solves this problem by providing a highly compact, URL-friendly, and secure alternative to traditional UUIDs. By leveraging a carefully crafted, larger alphabet, NanoId achieves comparable collision resistance to UUID v4 while significantly reducing the character length (21 characters vs. 36 characters). This smaller footprint translates directly to reduced storage overhead in databases, shorter payload sizes in network requests, and cleaner, more readable URLs in web applications.

Creating a dedicated Kotlin Multiplatform (KMP) port of NanoId empowers developers to use this excellent library across their entire ecosystem without relying on platform-specific implementations or third-party wrappers. With this KMP port, you can seamlessly integrate NanoId into your Android apps, iOS applications, backend JVM services, and even frontend web applications compiled via Kotlin/JS or Kotlin/Wasm. This guarantees a consistent, cryptographically secure ID generation strategy across your entire distributed architecture. It is an ideal fit for modern distributed systems, microservices, database keys, and event-driven architectures where cross-platform consistency and collision resistance are absolutely crucial.

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

Security and unpredictable randomness are at the core of NanoId. It utilizes Korlibs [Crypto SecureRandom](https://github.com/korlibs/korlibs-crypto){target="_blank"} to generate cryptographically strong random IDs with a proper distribution of characters. Unlike standard pseudo-random number generators (PRNGs) like `kotlin.random.Random`, which are predictable and unsuitable for security-sensitive contexts, this implementation guarantees cryptographic strength.

Under the hood, Crypto provides a `SecureRandom` class that extends the `kotlin.random.Random` class but overrides its behavior to generate cryptographically secure values using the host operating system's native entropy sources. This ensures the highest possible degree of unpredictability:

- **JVM & Android**: It uses `java.security.SecureRandom` on the JVM, coupled with essential `PRNGFixes` on Android to mitigate known historical vulnerabilities in early Android versions' entropy pools.
- **Apple & Native POSIX**: On macOS, iOS, Linux, and other POSIX-compliant systems, it reads directly from the OS-level `/dev/urandom` or uses `arc4random_buf`, providing non-blocking access to the kernel's entropy generator.
- **Windows**: It leverages `BCryptGenRandom`, the modern cryptographic API provided by Microsoft for secure random number generation.

This heavy reliance on native cryptographic APIs ensures that generated IDs are highly resistant to predictability attacks. Furthermore, NanoId employs a robust algorithm to ensure uniform distribution of characters from its alphabet, mitigating any bias that could increase the likelihood of collisions. When combined with its 21-character default length and an alphabet of 64 characters, NanoId provides a staggering 64^21 possible combinations, making the probability of a collision computationally negligible, even at high generation rates in massive distributed systems.

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
