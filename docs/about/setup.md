# Setup

The following steps describe how to pull the Kotlin libraries from the [**sponsors-only**](../sponsors/) repository.

## Requirements

- GitHub account
- Active sponsorship
- GitHub Packages access enabled

## 1. Generate a GitHub Token

Create a **Personal Access Token** with the following scopes:

- `repo`
- `read:packages`

## 2. Configure Gradle

Add the credentials to your `local.properties` file:

```
gpr.user=YOUR_GITHUB_USERNAME
gpr.key=YOUR_GITHUB_TOKEN
```

## 3. Prepare Repository Access

Add these methods to your `settings.gradle.kts` file, you can edit and change them to your liking or project configuration:

```kotlin
fun findProperty(key: String): String? {
    val localProperties = java.util.Properties().apply {
        val file = rootDir.resolve("local.properties")
        if (file.exists()) {
            file.inputStream().use {
                load(it)
            }
        }
    }

    return providers.gradleProperty(key).orNull?.ifBlank {
        null
    } ?: localProperties.getProperty(key)?.ifBlank { null }
}

fun RepositoryHandler.iNKraftRepository(repository: String) {
    maven {
        name = "iNKraft $repository"
        url = uri("https://maven.pkg.github.com/iN-Kraft/$repository")
        credentials {
            username = findProperty("gpr.user")
            password = findProperty("gpr.key")
        }
    }
}
```

## 4. Add the Repository

Add this configuration to your `settings.gradle.kts` file:

```kotlin
dependencyResolutionManagement {
    repositories {
        // ... your default repositories like google() and mavenCentral() etc
        iNKraftRepository("Native-Kommons")
    }
}
```

## 5. Sync & Build

Sync the project.
If your sponsorship is active, dependencies will resolve automatically.

## Next Steps

Now that you've successfully configured your environment, you're ready to start exploring the libraries! Check out our [Projects Overview](../projects/index.md) to discover all the available libraries and how to use them.
