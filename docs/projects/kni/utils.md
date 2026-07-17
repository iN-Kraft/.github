---
icon: octicons/tools-24
tags:
  - Android
  - MacOS
  - Linux
  - Windows
---

# Native Arrays and Utilities

Working with primitive arrays and platform-specific environment pointers is a core requirement of JNI, but it is also highly susceptible to memory leaks.

When the JVM passes an array (like a `jintArray` or `jbyteArray`) to native code, it must pin that array in memory to prevent the Garbage Collector from moving it while native code accesses it. If the native code forgets to explicitly release that array when finished, the JVM heap will eventually run out of memory.

KNI provides a comprehensive suite of utility extensions to safely map between Kotlin primitives and JNI arrays, ensuring memory is always scoped and released correctly.

## Safe Array Conversions

KNI supports bidirectional conversions for all native array types: `jbooleanArray`, `jbyteArray`, `jcharArray`, `jdoubleArray`, `jfloatArray`, `jintArray`, `jlongArray`, and `jshortArray`.

### JVM Array to Kotlin Array

To safely convert a JNI array into a standard Kotlin array, use the `.toK...Array()` extensions.

Internally, these functions call `Get...ArrayElements` to access the C-pointer, copy the data into a newly scoped Kotlin array, and critically, guarantee the execution of `Release...ArrayElements` before returning. This prevents the classic "pinned array" memory leak.

```kotlin
@CName("Java_your_package_name_ClassName_processNumbers")
fun processNumbers(env: CPointer<JNIEnvVar>, clazz: jobject, numbers: jintArray) {
    // Extracts elements, copies to a Kotlin IntArray, and immediately releases the JNI lock
    val kotlinArray: IntArray? = numbers.toKIntArray(env)
    
    kotlinArray?.forEach { number ->
        println("Received: $number")
    }
}
```

!!! warning "Manual Releasing"

    If you choose to use the lower-level `.getIntElements(env)` function directly to avoid a memory copy, you must manually call `.releaseElements(env, elements)` when you are finished. For most use cases, the automatic `.toKIntArray()` is highly recommended for safety.

### Kotlin Array to JVM Array

When returning arrays from native code to the JVM, KNI provides `.toJ...Array()` extensions. These functions handle the allocation of the array on the JVM heap and securely copy the native memory block into the JVM using memory pinning (`usePinned`).

```kotlin
@CName("Java_your_package_name_ClassName_generateBytes")
fun generateBytes(env: CPointer<JNIEnvVar>, clazz: jobject): jbyteArray? {
    val localBytes = ByteArray(1024) { 0x01.toByte() }
    
    // Allocates a jbyteArray and safely copies the native memory over
    return localBytes.toJByteArray(env)
}
```

## Environment and JVM Utilities

Because Kotlin Multiplatform interacts with different underlying SDKs depending on the target, you often need to cast or convert environment pointers, especially when bridging code between Android-specific implementations and standard KNI code.

### Casting Environment Pointers

KNI provides seamless reinterpret-casting functions to move between `platform.android` bindings and `dev.datlag.kommons.jni` bindings without manual memory hacking.

```kotlin
fun bindAndroidEnvironment(env: CPointer<JNIEnvVar>) {
    // Convert KNI Env to Android specific Env
    val androidEnv: CPointer<platform.android.JNIEnvVar> = env.toAndroid()
    
    // Convert back to common KNI Env
    val commonEnv: CPointer<JNIEnvVar> = androidEnv.toKNI()
}
```

### Fetching the JavaVM

If you need to attach a native thread to the JVM (for example, to make asynchronous callbacks to Java from a background C++ thread), you must retrieve the global `JavaVM` pointer. KNI simplifies this JNI invocation:

```kotlin
fun attachBackgroundThread(env: CPointer<JNIEnvVar>) {
    // Safely fetches the global JavaVM pointer from the current environment
    val jvm = env.getJavaVM()
    
    // You can now use 'jvm' to call AttachCurrentThread in background workers
}
```