---
title: Render Pipeline
description: Understand Spellbook's point-buffer render lifecycle and performance rules.
---

# Render Pipeline

Each frame follows the same pipeline.

```text
EffectContext
    |
    v
Shape.sample(...)
    |
    v
Transform.prepare(...), then apply to every point
    |
    v
EffectModifier.apply(...)
    |
    v
ParticleEmitter.spawn(...) for every final point
```

All shape coordinates are local to the effect origin. The renderer adds `EffectContext.origin()` to each final local point before calling the emitter.

## PointBuffer

`PointBuffer` is mutable frame-local point storage.

Common operations:

| Method | Purpose |
| --- | --- |
| `add(x, y, z)` | append a point |
| `set(index, x, y, z)` | replace a point |
| `x(index)`, `y(index)`, `z(index)` | read coordinates |
| `setX`, `setY`, `setZ` | edit one coordinate |
| `translate(index, dx, dy, dz)` | add deltas |
| `remove(index)` | remove while preserving order |
| `removeUnordered(index)` | remove by moving the last point into the removed slot |
| `ensureCapacity(pointCapacity)` | reserve storage |
| `forEach(...)` | iterate current points |
| `toVectorList()` | copy points into defensive `Vector3f` snapshots |

Use `removeUnordered(...)` when point order does not matter. It is cheaper than preserving order.

## Frame-Local Lifetime

Do not retain `PointBuffer` references, scratch buffers, or mutable point values after the current callback returns.

This applies to:

- `Shape.sample(...)`
- `Transform.apply(...)`
- `EffectModifier.apply(...)`
- `ParticleEmitter.spawn(...)`

If a component needs to keep point data, copy values into its own immutable or owned storage.

```java
List<Vector3f> snapshot = points.toVectorList();
```

## Scratch Buffers

`ShapeContext` provides scratch buffers for compound shapes.

```java
PointBuffer childA = context.scratchBuffer(0);
PointBuffer childB = context.scratchBuffer(1);

childA.clear();
childB.clear();
```

Use `reserveScratchBuffers(...)` when a shape samples child shapes that may also use scratch buffers.

```java
try (ShapeContext.ScratchScope ignored = context.reserveScratchBuffers(2)) {
    source.sample(context, childA);
    target.sample(context, childB);
}
```

`MorphShape` uses this pattern internally.

## Render State Reuse

`EffectInstance.render(context)` creates fresh render state for that call.

`EffectExecutor` owns one `EffectRenderState` per running effect and reuses it across frames. This reduces allocation for long-running effects.

When manually rendering repeated frames, you can pass caller-owned state.

```java
EffectRenderState state = new EffectRenderState();

effect.render(context0, state);
effect.render(context1, state);
```

Do not share one `EffectRenderState` between concurrently running effects.

## Empty Viewer Optimization

`EffectExecutor` skips frames with no viewers by default. That means shapes, transforms, modifiers, and emitters are not called for those frames.

Disable this when component side effects must still happen without viewers.

```java
EffectExecutionConfig config = EffectExecutionConfig.builder()
        .originAnchor(new FixedAnchor(origin))
        .viewerSource(viewerSource)
        .skipEmptyViewerFrames(false)
        .build();
```

Most visual effects should keep the default.

