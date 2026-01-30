---
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🗄️ Cache

A high-performance, coroutine-based cache library for Kotlin Multiplatform.  
It is designed for high concurrency and thread-safety, offering flexible configurations for size, time and policy-based eviction.

## 🎯 Supported Targets

The following targets are supported:

| Platform           | Targets                                       |
|:-------------------|:----------------------------------------------|
| **JVM & Android**  | `jvm`, `android`                              |
| **Apple**          | `ios`, `macos`, `tvos`, `watchos`             |
| **Web**            | `js`, `wasmJs`                                |
| **Native & Other** | `androidNative`, `linux`, `mingw`, `wasmWasi` |

## ✨ Features

- **Coroutine-Based:** Utilizes `suspend` functions for non-blocking cache operations
- **Thread-Safe:** Safe for concurrent access from multiple coroutines
- **Size-Binding:** You can enforce a maximum cache size
- **Eviction Policies:** Supports several strategies
    * **LRU:** Least Recently Used
    * **MRU:** Most Recently Used
    * **LFU:** Least Frequently Used
    * **FIFO:** First In, First Out
    * **FILO:** First In, Last Out
- **Time-Based Expiry:** Configure entries to expire after write or after access
- **Flexible API:** Provides both `suspend` functions for atomic operations non-suspending `try...` methods for fast, non-blocking lookups
- **AutoClosable:** Can be used in `use { ... }` blocks to release resources if needed.

## 🚀 Installation

Integration using Version Catalog is highly recommended for aligned version usage.

=== "InMemory"

    ```toml
    [libraries]
    kommons-cache = { group = "dev.datlag.kommons", name = "cache", version.ref = "kommons" }
    ```

Then add the dependency to your module:

=== "InMemory"

    ```kotlin
    dependencies {
        implementation(libs.kommons.cache)
    }
    ```

## 🛠️ Usage

You can initialize the cache with a type-safe DSL. The `maxSize` parameter is mandatory, while additional configuration options are optional.

=== "InMemory"

    ```kotlin
    val cache = InMemoryCache<Int, String>(maxSize = 100) {
        evictionPolicy = EvictionPolicy.LRU
        expireAfterWriteDuration = 15.minutes
    }
    ```

The cache interface follows the suspend-first approach, providing common methods for cache as suspending operations.

```kotlin
suspend fun getCachedTitle(id: Int): String {
    return cache.get(id) ?: "Default Title"
}

suspend fun putCachedTitle(id: Int, title: String) {
    cache.put(id, title)
}
```

The `get` and `put` methods are also available as operator functions, like this:

```kotlin
suspend fun getCachedTitle(id: Int): String {
    return cache[id] ?: "Default Title"
}

suspend fun putCachedTitle(id: Int, title: String) {
    cache[id] = title
}
```

=== "InMemory"

    If you are calling the cache from a context where `suspend` is not available, you can use the non-suspending `try...` methods.

    ```kotlin
    fun getOnMainThread(id: Int): String? {
        return cache.tryGet(id)
    }

    fun putOnMainThread(id: Int, title: String) {
        cache.tryPut(id, title)
    }
    ```
