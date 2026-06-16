---
title: Built-In Components
description: Reference for built-in Spellbook effect shapes, transforms, morphs, and emitters.
---

# Built-In Components

Spellbook includes common shapes, transforms, and emitters for Java construction and config parsing.

## Shapes

All shapes write local-space points into a `PointBuffer`.

| Shape | Constructor | Notes |
| --- | --- | --- |
| `LineShape` | `new LineShape(points)` | Samples from origin to target. Emits no points when origin or target is missing. |
| `SphereShape` | `new SphereShape(radius, points)` | Samples points on a sphere surface centered at local origin. |
| `SphereShape` | `new SphereShape(radius, points, angularSpeed)` | Rotates sampling by `step * angularSpeed`. |
| `CubeShape` | `new CubeShape(size, pointsPerEdge)` | Samples the 12 cube edges, centered at local origin. |
| `HelixShape` | `new HelixShape(strands, particlesPerStrand, radius, height, turns, rotationSpeed)` | Samples one or more vertical helix strands. |
| `SpiralHelixShape` | `new SpiralHelixShape(strands, particlesPerStrand, radius, height, curve, rotationSpeed)` | Samples expanding spiral strands. |
| `SpiralHelixShape` | `new SpiralHelixShape(strands, particlesPerStrand, radius, height, curve, rotationSpeed, reverse)` | Optional reverse winding direction. |
| `MovingPointShape` | `new MovingPointShape(speed, spacing, amountPoints, pingPong)` | Moves points along origin-to-target over render steps. |
| `MorphShape` | `MorphShape.between(source, target)...build()` | Interpolates sampled points between two child shapes. |

## Shape Validation

Built-in shapes validate constructor arguments early.

Examples:

- counts must usually be greater than `0`
- `CubeShape` needs at least `2` points per edge
- radii and sizes must be greater than `0`
- helix `height` may be `0`, but not negative

Invalid values throw `IllegalArgumentException`.

## Transforms

Transforms mutate sampled local points before modifiers and emission.

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new CubeShape(2.0f, 4))
        .transform(new TranslateTransform(0, 1, 0))
        .transform(new RotationTransform(0, 45, 0))
        .particle(Particle.END_ROD)
        .build();
```

| Transform | Purpose |
| --- | --- |
| `TranslateTransform` | Adds an offset to each point. |
| `RotationTransform` | Rotates each point by Euler angles or a quaternion. |
| `LookAtTransform` | Rotates local points to face the context target. |

`LookAtTransform` needs an origin and target in the `EffectContext`. If no usable target direction exists, it leaves points unchanged.

## Standard Particle Emitter

`StandardParticleEmitter` spawns one Bukkit particle call per final point for every viewer.

```java
StandardParticleEmitter<Void> emitter = StandardParticleEmitter.of(Particle.FLAME, 2);
```

For full particle options, use `ParticleSpec`.

```java
ParticleSpec<Void> spec = new ParticleSpec<>(
        Particle.FLAME,
        2,
        0.05,
        0.05,
        0.05,
        0.0,
        null
);
```

`StandardParticleEmitter` does not require direction data, so the render pipeline skips direction-provider calls for it.

## Morph Shapes

Morphs sample two child shapes and interpolate between their points.

```java
Shape morph = MorphShape.between(
                new SphereShape(1.0f, 48),
                new CubeShape(2.0f, 5)
        )
        .overSteps(40)
        .strategy(MorphPointStrategies.resampleToMax())
        .build();
```

Progress providers:

| Factory | Meaning |
| --- | --- |
| `MorphProgress.fixed(value)` | same progress every frame |
| `MorphProgress.overSteps(durationSteps)` | step-based `0..1` from step `0` |
| `MorphProgress.afterStep(startStep, durationSteps)` | delayed step-based progress |
| `MorphProgress.overSeconds(durationSeconds)` | time-based `0..1` from elapsed `0` |
| `MorphProgress.afterSeconds(startSeconds, durationSeconds)` | delayed time-based progress |
| `MorphProgress.triggeredOverSteps(durationSteps)` | mutable trigger handle |

Point strategies:

| Strategy | Output Count |
| --- | --- |
| `matchIndex()` | smaller child point count |
| `resampleSourceToTarget()` | target point count |
| `resampleTargetToSource()` | source point count |
| `resampleToMax()` | larger child point count |

`TriggeredMorphProgress` is mutable. Create one instance per independent running effect when each execution needs separate trigger timing.

