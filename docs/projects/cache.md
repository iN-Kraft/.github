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
    kommons-cache = { group = "dev.datlag.kommons", name = "cache", version.ref = "cache" }
    ```

=== "File"

    Under Development

=== "KTOR"

    Under Development

Then add the dependency to your module:

=== "InMemory"

    ```kotlin
    dependencies {
        implementation(libs.kommons.cache)
    }
    ```

=== "File"

    Under Development

=== "KTOR"

    Under Development

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

## ⚡ Performance Benchmarks

This cache library was built from the ground up for extreme performance and thread safety while supporting all Kotlin Multiplatform targets.
To prove it, we benchmarked the `InMemoryCache` against other popular KMP caching libraries: Cache4K and Kache.

### 🔍 Methodology

Tests were executed using `kotlinx-benchmark` (JMH) measuring the Average Time (ns/op) (lower is better).

- Cache Sizes: 100, 1000 and 10000 entries
- Eviction Policy: LRU (Least Recently Used)
- Workload: Randomized key access on a cache pre-populated to 50% capacity
- Environments: Both **Blocking** (synchronous `tryGet`/`tryPut`) and **Suspending** (coroutine-safe `get`/`put`) paths were measured

### 📖 Read Performance (`get`)

Measured in nanoseconds per operation (ns/op). Lower is better.

|         Library        | Cache Size | Blocking | Suspending |
|:----------------------:|:----------:|----------|------------|
| iNKraft/Cache          | 100        | 65       | 174        |
|                        | 1000       | 69       | 191        |
|                        | 10000      | 87       | 196        |
| MayakaApps/Kache       | 100        | 33       | 170        |
|                        | 1000       | 33       | 179        |
|                        | 10000      | 40       | 197        |
| ReactiveCircus/cache4k | 100        | 7648     | 6470       |
|                        | 1000       | 6998     | 6417       |
|                        | 10000      | 6897     | 7365       |

### ✍️ Write Performance (`put`)

Measured in nanoseconds per operations (ns/op). Lower is better.

|         Library        | Cache Size | Blocking | Suspending |
|:----------------------:|:----------:|----------|------------|
| iNKraft/Cache          | 100        | 72       | 199        |
|                        | 1000       | 89       | 210        |
|                        | 10000      | 115      | 258        |
| MayakaApps/Kache       | 100        | N/A      | 192        |
|                        | 1000       | N/A      | 195        |
|                        | 10000      | N/A      | 239        |
| ReactiveCircus/cache4k | 100        | 15245    | 13065      |
|                        | 1000       | 12904    | 13754      |
|                        | 10000      | 12348    | 12689      |

(Note: MayakaApps/Kache does not expose a blocking put function.)

### 💡 Key Takeaways

1. **Outperforms:** iNKraft/Cache outperforms ReactiveCircus/cache4k by **~100x** on reads and **~170x** on writes
2. **Coroutines & Thread Safety:** While MayakaApps/Kache is slightly faster, it comes with a cost of exceptions, crashes and lost data in high concurrency scenarios ([see issue #239](https://github.com/MayakaApps/Kache/issues/239){target="_blank"})
3. **Blazing Fast Synchronous Paths:** Need data immediately on the Main Thread? The `tryGet` and `tryPut` operations execute in under 100 nanoseconds, making them practically invisible to your frame rendering process
4. **Target Support:** Unlike the other library iNKraft/Cache supports **all** KMP targets