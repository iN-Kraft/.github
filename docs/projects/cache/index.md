---
icon: octicons/cache-24
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

## 📦 Available Modules

Choose the caching layers you need for your project:

<div class="grid cards" markdown>
- :octicons-cpu-24:{ .middle } InMemoryCache

    ---

    The foundational L1 cache. Ultra-fast, Mutex-backed, non-blocking fallback mechanisms, and advanced time-to-live (TTL) configurations.

- :octicons-file-zip-24:{ .middle } FileCache

    ---

    A crash-safe, append-only journaled disk cache. Native zero-allocation `DataSize` syntax, serialization codecs, and optional L1 pairing.

- :octicons-server-24:{ .middle } KtorCache

    ---

    A ready-to-use adapter for Ktor Client HTTP caching. Automatically calculates real HTTP body byte sizes to evict data intelligently.
</div>

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

## ⚡ Performance Benchmarks

This cache library was built from the ground up for extreme performance and thread safety while supporting all Kotlin Multiplatform targets.
To prove it, we benchmarked the `InMemoryCache` against other popular KMP caching libraries: Cache4K and Kache.

### 🔍 Methodology

Tests were executed using `kotlinx-benchmark` (JMH) measuring the Average Time (ns/op) (lower is better).

- Cache Sizes: 100, 1000 and 10000 entries
- Eviction Policy: LRU (Least Recently Used)
- Workload: Randomized key access on a cache pre-populated to 50% capacity
- Environments: Both **Blocking** (synchronous `tryGet`/`tryPut`) and **Suspending** (coroutine-safe `get`/`put`) paths were measured

!!! warning "Note on Suspending calls"

    Measuring these functions required starting a new coroutine (`runBlocking`) for every single test, which adds an delay to the results.
    In your actual app, these operations will run significantly faster than what is shown here.

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