---
title: "InMemoryCache"
description: "An ultra-fast, L1 in-memory caching tier designed for high concurrency with coroutine-friendly Mutex protection."
icon: octicons/cpu-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🧠 InMemoryCache

The `InMemoryCache` is the ultra-fast L1 tier. It runs purely in RAM and is designed to sit safely behind a coroutine-friendly Mutex to prevent race conditions during highly concurrent modifications.

## 🚀 Installation

Integration using Version Catalogs is highly recommended.

```toml
[libraries]
kommons-cache = { group = "dev.datlag.kommons", name = "cache", version.ref = "cache" }
```

Add the dependency to your module:

```kotlin
dependencies {
    implementation(libs.kommons.cache)
}
```

## 🛠️ Usage

You can initialize the cache using a type-safe DSL. The `maxSize` parameter is mandatory, while additional configuration options (like time-based expiry and eviction algorithms) are optional.

```kotlin
val cache = InMemoryCache<Int, String>(maxSize = 100) {
    evictionPolicy = EvictionPolicy.LRU
    expireAfterWrite(15.minutes)
    expireAfterAccess(5.minutes)
}
```

### Standard Suspending Operations

The interface defaults to a suspend-first approach to guarantee thread safety without blocking the underlying JVM/Native thread.

```kotlin
suspend fun getCachedTitle(id: Int): String {
    return cache.get(id) ?: "Default Title"
}

suspend fun putCachedTitle(id: Int, title: String) {
    cache.put(id, title)
}
```

You can also use operator functions for a cleaner syntax:

```kotlin
suspend fun getCachedTitle(id: Int): String {
    return cache[id] ?: "Default Title"
}

suspend fun putCachedTitle(id: Int, title: String) {
    cache[id] = title
}
```

### Blocking (Non-Suspending) Fast-Paths

If you are calling the cache from a context where suspend is not available (like the Main UI thread), you can use the non-suspending `try...` methods.

These will attempt to acquire the lock. If the lock is held by another coroutine, they fail fast and return safely (e.g., returning null).

```kotlin
fun getOnMainThread(id: Int): String? {
    return cache.tryGet(id)
}

fun putOnMainThread(id: Int, title: String) {
    val success = cache.tryPut(id, title)
    if (!success) {
        println("Cache was busy!")
    }
}
```

### Smart Size Calculators

By default, maxSize refers to the count of items in the cache. However, you can write a custom `SizeCalculator` to configure your limit based on real weights (like byte sizes or string lengths):

```kotlin
val cache = InMemoryCache<String, String>(maxSize = 1024 * 1024) { // 1 MB limit
    sizeCalculator { _, value -> 
        value.encodeToByteArray().size.toLong() 
    }
}
```