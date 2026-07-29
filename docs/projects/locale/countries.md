---
title: "ISO Countries & Continents"
description: "Ensure compile-time safety and prevent string bugs with an exhaustive representation of all 249 officially assigned ISO countries using zero-allocation value classes."
icon: octicons/project-roadmap-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 🗺️ ISO Countries & Continents

At the heart of the `Locale` library is an exhaustive, strictly-typed representation of global geography.

Handling country codes in software is notoriously error-prone. Backends might send an ISO 3166-1 Alpha-2 code (`US`), an Alpha-3 code (`USA`), a UN M49 numeric code (`840`), or even an E.164 telephone prefix (`+1`). If these are all treated as standard `String` and `Int` types in Kotlin, it is incredibly easy to accidentally pass a telephone code into a function that expects a domain suffix.

Our Locale prevents these bugs entirely by wrapping all 249 officially assigned ISO countries in a massive, strictly-typed `Country` enum utilizing Kotlin's `@JvmInline value class` architecture.

## 🔒 Type Safety with Value Classes

Every country property is wrapped in a specific `Code` interface. Because these are inline value classes, they incur **zero runtime memory allocation overhead** while providing absolute compile-time safety.

```kotlin
val germany = Country.Germany

// These are strictly typed, not just raw Strings/Ints
val alpha2: Country.Code.Alpha2 = germany.codeAlpha2       // "DE"
val alpha3: Country.Code.Alpha3 = germany.codeAlpha3       // "DEU"
val numeric: Country.Code.Numeric = germany.codeNumeric    // 276
val domain: Country.Code.Domain = germany.domain           // ".de"
```

Because of this strict typing, a function signature can explicitly demand an Alpha-2 code, and the compiler will reject any attempt to pass an Alpha-3 code.

## 🔍 Resolving Countries

When you receive unverified input from a user, a file, or a network request, you must resolve it to a valid Country object safely.

The library provides safe `findBy...` methods that return nullable results, preventing your application from crashing due to unexpected or malformed external data.

```kotlin
// 1. Find by standard 2-letter ISO code
val uk = Country.findByAlpha2("GB")

// 2. Find by 3-letter ISO code
val aus = Country.findByAlpha3("AUS")

// 3. Find by UN Numeric code
val japan = Country.findByNumeric(392)

// 4. Unified lookup (checks length/type automatically)
val unknown = Country("FRA") 
```

### Automatic Formatting Validation

Before the library even iterates through the 249 enum entries to find a match, it validates the formatting of the requested string. For example, `Code.Alpha2.isValidFormat()` ensures the string is exactly two characters and consists only of Latin letters.

## 🌍 Continents and Regions

Every `Country` is accurately mapped to a `Continent`. This is incredibly useful for analytics tracking, region-locking features, or routing network requests to the geographically closest server.

Continents support lookup via:

- **GeoName format:** `AF`, `AS`, `EU`, `NA`, `OC`, `SA`, `AN`
- **STANAG 1059 format:** `FFF`, `EEE`, etc.
- **UN M49 Numeric format:** `2`, `142`, `150`, etc.

```kotlin
val continent = Country.France.continent

println("France is located in: ${continent.name}") 
// Output: Europe

// You can also retrieve all countries within a continent:
val europeanCountries: Set<Country> = Continent.Europe.countries
```

## 📱 Telephone and Emoji Support

Building user interfaces requires more than just backend codes. The `Country` enum natively supports UI-level attributes out of the box:

- **Emoji Flags:** You can instantly retrieve the Unicode emoji flag for any country via `Country.emoji` (e.g., 🇺🇸, 🇩🇪).
- **Dialing Codes:** Need to build a phone number input with a country dropdown? You can access the official ITU-T E.164 dialing codes via the `telephoneCodes` property.