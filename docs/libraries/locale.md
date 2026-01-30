# 🌍 Locale

A simple, serializable and modern Kotlin data class for handling locales.  
This library provides a type-safe alternative to `java.util.Locale`, designed for Kotlin Multiplatform projects.

## 🎯 Supported Targets

The following targets are supported:

| Platform           | Targets                                       |
|:-------------------|:----------------------------------------------|
| **JVM & Android**  | `jvm`, `android`                              |
| **Apple**          | `ios`, `macos`, `tvos`, `watchos`             |
| **Web**            | `js`, `wasmJs`                                |
| **Native & Other** | `androidNative`, `linux`, `mingw`, `wasmWasi` |

## ✨ Features

- **Serializable:** Annotated with `@Serializable`, ready for `kotlinx.serialization` (JSON, Protobuf, etc.)
- **Rich Data Models:** Provides type-safe `Country` and `Continent` classes packed with useful data like __ISO codes__ (Alpha-2, Alpha-3, Numeric), __telephone codes__, __domains__, __continent codes__ and even __emoji flags__.
- **Flexible Parsing:** Can parse locales from common language tags (e.g. `en-US` or `fr_CA`) with customizable delimiters.
- **Java Interop:** Seamless integration with `java.util.Locale` for easy migration.
- **Apple Interop:** Seamless integration with `Foundation.Locale` for easy migration.

## 🚀 Installation

Integration using Version Catalog is highly recommended for aligned version usage.

=== "Version Catalog"

    First declare the library in your Version Catalog:

    ```toml
    [libraries]
    kommons-locale = { group = "dev.datlag.kommons", name = "locale", version.ref = "kommons" }
    ```
    
    Then add the dependency to your module:
    
    ```kotlin
    dependencies {
        implementation(libs.kommons.locale)
    }
    ```

=== "Gradle"

    Simply add the dependency like this:

    ```kotlin
    dependencies {
        implementation("dev.datlag.kommons:locale:<version>")
    }
    ```

## 🛠️ Usage

=== "Locale"

    Creating a Locale object:

    ```kotlin
    // From language and country strings
    val byStrings = Locale("en", "US")
    
    // By parsing a BCP 47 language tag (handles mixed delimiters)
    val byTag = Locale.forLanguageTag("sr_Latn-RS")
    
    // Get the system's default locale
    val systemDefault = Locale()
    
    // Using the full constructor for scripts and variants
    val fullLocale = Locale(
        language = "zh",
        country = "CN",
        script = "Hans",
        variant = "PINYIN"
    )
    ```

    <h3>Getting Properties</h3>
    
    Accessing Locale properties is easy:

    ```kotlin
    val locale = Locale.forLanguageTag("fr-CA")
    
    println(locale.language) // "fr"
    println(locale.country) // Country object for Canada
    ```

    <h3>Converting to a Language Tag</h3>
    
    The `toString()` method is implemented to return a BCP 47 compliant language tag.
    
    ```kotlin
    val locale = Locale("zh", "CN", script = "Hans")
    println(locale.toString()) 
    // Output: "zh-Hans-CN"
    ```

=== "Country"

    Receiving a Country object:

    ```kotlin
    // Look up by Alpha-2, Alpha-3
    // Also tries to parse numeric code
    val byString = Country.forCodeOrNull("DE")
    
    // Look up by ISO 3166-1 numeric code
    val byNumber = Country.forCodeOrNull(8) // Albania
    ```

    <h3>Getting Properties</h3>
    
    Accessing the rich Country object:
    
    ```kotlin
    val country = locale.country
    if (country != null) {
        println(country.emoji)        // "🇨🇦"
        println(country.codeAlpha3)   // e.g., Code.Alpha3("CAN")
        println(country.codeNumeric)  // e.g., Code.Numeric("124")
        println(country.telephoneCodes) // e.g., [Code.Telephone("+1")]
        println(country.continent)    // Continent object for Country
    }
    ```

    <h3>Code Types</h3>

    All code types (Code.Alpha2, Code.Alpha3, Code.Numeric, etc...) implement either a CharSequence or extend Number.  
    This decision was made to be as flexible as possible instead of simply providing a String, while providing and keeping easy usage.

=== "Continent"

    Receiving a Continent object:

    ```kotlin
    // Look up by GeoName or STANAG code
    // Also tries to parse UN M49 code
    val byString = Continent.forCodeOrNull("EU") // Europe
    
    // Look up by UN M49 code
    val byNumber = Continent.forCodeOrNull(142) // Asia
    ```

    <h3>Getting Properties</h3>
    
    Access nested Continent data:
    
    ```kotlin
    val continent = country.continent
    println(continent.geoName) // e.g., Code.GeoName("NA")
    ```
    
    <h3>Code Types</h3>
    
    All code types (Code.GeoName, Code.STANAG, Code.Numeric) implement either a CharSequence or extend Number.  
    This decision was made to be as flexible as possible instead of simply providing a String, while providing and keeping easy usage.
