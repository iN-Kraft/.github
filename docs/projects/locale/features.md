---
title: "Locale Serialization & Measurement Systems"
description: "Keep your JSON payloads compliant and minimal with custom KSerializer implementations, and effortlessly determine the proper regional measurement system."
icon: octicons/package-24
tags:
  - Android
  - JVM
  - Apple
  - Linux
  - Web
  - Windows
---

# 📦 Serialization & Features

In modern multiplatform architecture, locales and countries are rarely just kept in memory. They are constantly serialized to disk (for user preferences) or transmitted over the network (to REST APIs or databases).

Because our Locale module utilizes deep object graphs (where a `Locale` contains a `Country`, which contains multiple `Code` value classes), standard JSON serialization would normally result in a massive, bloated JSON object.

To solve this, the library features custom `KSerializer` implementations for all core classes, ensuring that your JSON payloads remain tiny, compliant, and easy to interact with across different backend technologies.

## 🔄 Locale Serialization

By default, the `Locale` class serializes itself into a standard IETF BCP 47 language tag string. This ensures perfect compatibility with standard web technologies and other languages like Python or Go.

```kotlin
val userLocale = Locale.US
val jsonString = Json.encodeToString(userLocale)

println(jsonString) 
// Output: "en-US" (Serialized as a primitive string, not an object!)

// Deserialization works automatically
val decoded: Locale? = Json.decodeFromString<Locale?>("\"en-US\"")
```

## 🌍 Country Serialization Flexibility

Different databases and APIs have different requirements for how they store countries. A legacy banking API might require numeric IDs, while a modern GraphQL endpoint expects Alpha-2 strings.

By default, the `Country` class uses the `CountryAsAlpha2StringSerializer`, serializing the massive enum down to a simple 2-letter string (e.g., `"DE"`).

### Overriding the Default Serializer

If your specific application architecture requires a different format, the library provides alternative serializers that you can apply using the `@Serializable(with = ...)` annotation in your data classes.

Available serializers include:

- `CountryAsAlpha2StringSerializer` (Default: `"US"`)
- `CountryAsAlpha3StringSerializer` (`"USA"`)
- `CountryAsNumericIntSerializer` (`840`)
- `CountryAsNumericStringSerializer` (`"840"`)

**Example:**

```kotlin
@Serializable
data class UserProfile(
    val username: String,
    // Forces this specific field to serialize as an integer
    @Serializable(with = CountryAsNumericIntSerializer::class)
    val originCountry: Country
)

// When serialized, originCountry will equal `840` instead of `"US"`
```

## 📏 Measurement Systems

One of the most frustrating aspects of multiplatform UI development is determining whether to show the user Celsius or Fahrenheit, Kilometers or Miles. In Java, this requires jumping through complex `DecimalFormat` hoops.

Inspired by Apple's Foundation framework, the `Locale` class provides a direct, highly performant `measurementSystem` property.

It calculates the proper system based strictly on the geographical country associated with the Locale:

```kotlin
val locale = Locale.US

when (locale.measurementSystem) {
    MeasurementSystem.METRIC -> println("Use Kilometers")
    MeasurementSystem.IMPERIAL -> println("Use Miles")
    MeasurementSystem.MIXED -> println("Use Miles for roads, Metric for science")
}
```

!!! note

    Only the US uses strict Imperial. The UK, Myanmar, and Liberia use a `MIXED` system, while the rest of the ISO registry defaults to `METRIC`.