---
title: Building Effects
description: Create and render Spellbook effect instances from Java.
---

# Building Effects

Use `EffectBuilder.create()` to construct an `EffectInstance`.

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new SphereShape(1.5f, 64))
        .particle(Particle.FLAME)
        .build();
```

`build()` requires both a shape and a particle emitter. Missing either one throws an `IllegalStateException`.

## Add Transforms

Transforms are applied in the order they are added.

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new CubeShape(2.0f, 4))
        .translate(0, 1.0f, 0)
        .rotate(0, 45, 0)
        .particle(Particle.END_ROD)
        .build();
```

Available builder shortcuts:

| Method | Adds |
| --- | --- |
| `translate(float x, float y, float z)` | `TranslateTransform` |
| `translate(Vector3f translation)` | `TranslateTransform` |
| `rotate(float yaw, float pitch, float roll)` | `RotationTransform` |
| `rotate(Quaternionf rotation)` | `RotationTransform` |
| `lookAtTarget()` | `LookAtTransform` |
| `lookAtTarget(Vector3f localForwardAxis)` | `LookAtTransform` with a custom local forward axis |

You can also add any `Transform` implementation directly.

```java
builder.transform(new TranslateTransform(0, 1, 0));
```

## Add Modifiers

Modifiers run after transforms and receive the whole `PointBuffer`.

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new SphereShape(1.0f, 32))
        .modifier((points, context) -> {
            for (int i = points.size() - 1; i >= 0; i--) {
                if (points.y(i) < 0) {
                    points.removeUnordered(i);
                }
            }
        })
        .particle(Particle.CRIT)
        .build();
```

Use modifiers for effects that need to add, remove, reorder, or bulk-edit sampled points.

## Configure Particles

The simplest particle setup uses a Bukkit `Particle`.

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new SphereShape(1.0f, 32))
        .particle(Particle.FLAME)
        .build();
```

Use `ParticleSpec` when you need count, offsets, extra, or particle data.

```java
ParticleSpec<Void> spec = new ParticleSpec<>(
        Particle.FLAME,
        3,
        0.05,
        0.05,
        0.05,
        0.0,
        null
);

EffectInstance effect = EffectBuilder.create()
        .shape(new SphereShape(1.0f, 32))
        .particle(spec)
        .build();
```

For advanced behavior, provide a custom `ParticleEmitter`.

## Render One Frame

You can render an effect directly without scheduling.

```java
EffectContext context = new EffectContext(
        origin.getWorld(),
        origin,
        target,
        viewers,
        0,
        0,
        0.0
);

effect.render(context);
```

Direct rendering creates fresh internal render state each call. For repeated rendering, prefer `EffectExecutor`, which reuses `EffectRenderState` for the running effect.

