---
title: "KNI Direct NIO Buffers"
description: "Utilize zero-copy Direct NIO Buffers to achieve extreme performance by sharing memory seamlessly between the JVM heap and Kotlin/Native applications."
icon: octicons/zap-24
tags:
  - Android
  - MacOS
  - Linux
  - Windows
---

# Direct NIO Buffers (Zero-Copy)

For high-performance multiplatform applications, such as custom rendering engines (OpenGL/Vulkan), audio processing pipelines, or massive file I/O operations, passing data between the JVM and native code using standard arrays is a massive performance bottleneck.

Standard JNI arrays require the JVM to copy the data from the JVM heap into native memory and then copy it back when the native operation finishes. This overhead is unacceptable in real-time applications.

## The Zero-Copy Solution

Java's `java.nio.ByteBuffer` (and its primitive siblings) solve this by utilizing "Direct Buffers." A direct buffer allocates memory entirely outside the JVM's garbage-collected heap. This means the JVM and your Kotlin/Native code can share the exact same memory address pointer. Reading or writing to this buffer incurs absolutely zero copy overhead.

KNI provides a robust `Buffer<T>` API to interact with these direct buffers from Kotlin/Native safely, abstracting away the complex `GetDirectBufferAddress` and `GetDirectBufferCapacity` JNI calls.

## Supported Buffer Types

KNI provides specialized, type-safe wrappers for all native JNI primitives:

- `ByteBuffer`
- `CharBuffer`
- `DoubleBuffer`
- `FloatBuffer`
- `IntBuffer`
- `LongBuffer`
- `ShortBuffer`

## Using Buffers in Native Code

To interact with a direct buffer, you wrap the raw `jobject` passed from Java into the corresponding KNI Buffer class. KNI utilizes Kotlin's operator overloading, making native memory manipulation feel exactly like interacting with a standard Kotlin Array.

### Reading and Writing

Here is an example of receiving an image buffer from the JVM, reading a byte, and mutating it in place. Because it is a direct buffer, the changes are instantly visible to the JVM without returning or copying an array.

```kotlin
@CName("Java_your_package_name_ClassName_processImageBuffer")
fun processImageBuffer(env: CPointer<JNIEnvVar>, clazz: jobject, rawBuffer: jobject) {
    // 1. Wrap the raw jobject into a KNI ByteBuffer
    val buffer = ByteBuffer(env, rawBuffer)
    
    // 2. Safely check capacity to ensure the buffer is valid
    val size = buffer.capacity ?: return
    
    // 3. Read directly from shared memory using operator overloading
    val firstByte: Byte? = buffer[0]
    
    if (firstByte != null) {
        // 4. Write directly back to shared memory
        // This modification is instantly accessible on the JVM side
        buffer[0] = (firstByte + 1).toByte()
    }
}
```

### Memory Safety and Boundaries

Direct memory access in C or C++ is notorious for causing segmentation faults if you read or write outside the allocated memory bounds.

The abstract `Buffer<T>` class in KNI internally handles boundary checks for you. When you attempt to `get` or `set` an index, KNI verifies that the index falls within `0..<capacity`. If the raw buffer pointer is invalid, or if the index is out of bounds, the operation safely returns `null` or `false` rather than crashing the entire native application process.