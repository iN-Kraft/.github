---
title: "KtorCache Adapter"
description: "Plug high-performance InMemory or FileCache instances directly into your Ktor HTTP client to optimize network operations and caching."
icon: octicons/server-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🌐 KtorCache

Ktor's HttpClient has an excellent built-in HttpCache plugin, but by default, it relies on simple memory structures.

We provide a KtorCache adapter, allowing you to plug either InMemoryCache or FileCache directly into Ktor's networking layer.

## 🚀 Installation

Ensure you have the Ktor Client dependencies installed alongside KtorCache:

```toml
[libraries]
kommons-cache-ktor = { group = "dev.datlag.kommons", name = "cache-ktor", version.ref = "cache" }
ktor-client = { group = "io.ktor", name = "ktor-client-core", version = "..." }
```

Add the dependency to your module:

```kotlin
dependencies {
    implementation(libs.kommons.cache.ktor)
    implementation(libs.ktor.client)
}
```

## 🛠️ Usage

The `KtorCache` adapter includes factory operators that completely simplify integration.

### In-Memory HTTP Caching

When you initialize a KtorCache with an InMemoryCache backing it, it automatically applies a smart SizeCalculator. This means the 50 megabyte limit applies to the actual downloaded byte payloads of the HTTP responses, rather than arbitrarily counting 50 HTTP entries!

```kotlin
val client = HttpClient {
    install(HttpCache) {
        // Keeps HTTP responses in RAM, dropping oldest responses once 50 MB is reached.
        publicStorage(
            KtorCache(maxSize = 50.mb) {
                evictionPolicy = EvictionPolicy.LRU
            }
        )
    }
}
```

### Persistent Disk HTTP Caching

Want to persist your web responses to disk so your app loads data instantly even after a reboot?

Simply use the `Path` based factory. The adapter will automatically inject the highly-optimized binary `CachedResponseDataCodec` to serialize your Ktor responses safely to the disk.

```kotlin
val persistentClient = HttpClient {
    install(HttpCache) {
        // Caches up to 250 MB of HTTP Responses to the local file system.
        publicStorage(
            KtorCache(
                directory = Path("my_ktor_cache"),
                maxSize = 250.mb
            ) {
                evictionPolicy = EvictionPolicy.LFU
            }
        )
    }
}
```

### Choosing the Right Storage Strategy

When deploying your Ktor applications under significant load or in resource-constrained environments, choosing the correct caching strategy is critical.

**InMemory Storage** is exceptionally fast and reduces latency to an absolute minimum. It is best suited for high-throughput, short-lived server processes or when caching small, frequently accessed payloads where disk I/O would become a bottleneck. However, it directly consumes your application's RAM, so configuring the `maxSize` properly is essential to avoid `OutOfMemoryError` under heavy traffic.

**Persistent File Storage**, on the other hand, is the ideal choice for client-side applications (like Android or iOS apps using Kotlin Multiplatform) and edge servers. It ensures that cached responses survive application restarts, significantly improving user experience on poor networks and reducing redundant data transfer costs. While disk access is slower than RAM, modern SSDs and OS-level file caching mitigate most of the performance penalty, making it highly reliable for larger payloads like images, heavy JSON structures, or static assets.