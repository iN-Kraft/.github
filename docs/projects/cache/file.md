---
icon: octicons/file-zip-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 📁 FileCache

The `FileCache` brings persistence to your Multiplatform application.

It is crash-safe, built on an append-only journal format, and uses atomic moves to ensure data is never corrupted, even if the device powers off during a write.

## 🚀 Installation

Integration using Version Catalogs is highly recommended.

```toml
[libraries]
kommons-cache-file = { group = "dev.datlag.kommons", name = "cache-file", version.ref = "cache" }
```

Add the dependency to your module:

```kotlin
dependencies {
    implementation(libs.kommons.cache.file)
}
```

## 🛠️ Usage

The `FileCache` operates on byte streams using `kotlinx-io`. To easily configure storage limits, we included an allocation-free `DataSize` class (.mb, .kb, .gb).

```kotlin
val cache = FileCache<String, String>(
    directory = Path("my_app_cache"),
    maxSize = 250.mb,
    codec = StringCodec
) {
    evictionPolicy = EvictionPolicy.LRU
}
```

### Serialization & Codecs

To store objects on the disk, `FileCache` requires a `CacheCodec`. We provide several out-of-the-box codecs for your convenience:

- `StringCodec`, `CharCodec`
- `ByteArrayCodec`, `ByteCodec`, `UByteCodec`
- `BooleanCodec`
- `DoubleCodec`, `FloatCodec`, `IntCodec`, `LongCodec`, `ShortCodec` - all support specifying the `ByteOrder`
- `UIntCodec`, `ULongCodec`, `UShortCodec` - all support specifying the `ByteOrder` too

### Tiered Architecture (L1 / L2)

By design, reading from a disk is slower than reading from RAM. `FileCache` natively supports a tiered architectural pattern. Simply pass an `InMemoryCache` instance to the builder to serve as an ultra-fast L1 tier!

The `FileCache` handles the synchronization logic between L1 and L2 for you.

```kotlin
val dualTierCache = FileCache<String, String>(
    directory = Path("cache"),
    maxSize = 500.mb,
    codec = StringCodec
) {
    // Automatically sets up L1 memory caching!
    l1Cache(maxSize = 100) {
        expireAfterWrite(10.minutes)
    }
}
```

When a user calls `dualTierCache.tryGet()`, the cache will instantly read from L1 Memory without suspending or blocking. If it's a cache miss, it seamlessly falls back to reading from the disk cache.