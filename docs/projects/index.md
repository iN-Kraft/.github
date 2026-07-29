---
title: Projects Overview
---

# Projects Overview

Welcome to the iNKraft Projects overview! Here you will find a detailed look at the various Kotlin Multiplatform (KMP) libraries we offer.

!!! note

    Most of our libraries are sponsor-only.
    To use any of these projects, you must first complete the [Setup Guide](../about/setup.md) to configure your environment for accessing our private repositories.

## Available Projects

### [Caching](cache/index.md)
A versatile and highly optimized caching infrastructure. It provides a robust set of strategies including in-memory caching, persistent file-based caching, and seamless Ktor integration across all supported platforms. Perfect for applications needing fast, reliable data access with minimal overhead.

### [Kotlin Native Interface (KNI)](kni/index.md)
KNI is a powerful suite of tools that bridges the gap between Kotlin and native system APIs. It provides unified, zero-overhead access to raw memory buffers, complex arrays, and system-level utilities. This allows you to squeeze out maximum performance for computationally intensive tasks while keeping your codebase idiomatic.

### [Locale & I18N](locale/index.md)
A comprehensive, multi-platform library for handling countries, continents, and region-specific features. It offers rich data structures for geographic information and includes powerful serialization capabilities, making it easy to build globalized applications without relying on platform-specific APIs.

### [Shadow Enum](shadow-enum.md)
Shadow Enum is a KSP-based library designed to bring true enum-like capabilities to Kotlin sealed classes. It eliminates the runtime overhead and reflection typically associated with iterating or looking up sealed class instances, generating highly optimized code at compile time for maximum performance.

### [NanoId](nanoid.md)
A lightning-fast, secure, and URL-friendly unique ID generator. By leveraging cryptographically strong native APIs on each platform, NanoId ensures high-quality randomness while generating compact, safe strings ideal for database keys, short links, or session identifiers.