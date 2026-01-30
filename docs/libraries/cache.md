# Cache

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

TBD
