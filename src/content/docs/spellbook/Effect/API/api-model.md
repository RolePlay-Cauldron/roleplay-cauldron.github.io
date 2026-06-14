---
title: Effect API Model
description: Understand the Spellbook effect engine API layers.
---

# Effect API Model

The effect API has three layers.

## Definition Layer

The definition layer describes what an effect is.

```text
EffectBuilder
    -> Shape
    -> Transform...
    -> EffectModifier...
    -> ParticleEmitter
    -> DirectionProvider
    -> EffectInstance
```

Use `EffectBuilder` for normal construction. Use the `EffectInstance` constructor only when integrating with lower-level code.

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new CubeShape(2.0f, 4))
        .rotate(0, 45, 0)
        .particle(Particle.END_ROD)
        .build();
```

`EffectInstance` is reusable. It stores immutable copies of its transform and modifier lists, and each running execution owns its own render state.

## Frame Layer

The frame layer describes one render call.

```text
EffectContext
    world
    origin
    target
    viewers
    step
    tick
    timeSeconds
```

`origin` is the world-space base location. Shapes output local coordinates relative to that origin.

`target` is optional, but line-based shapes and target-facing transforms need it. When a shape needs a target and none is available, it may emit no points.

`viewers` controls which players receive particles. `StandardParticleEmitter` spawns particles directly to those players.

## Execution Layer

The execution layer schedules frames over time.

```text
EffectExecutor
    -> EffectExecutionConfig
        -> origin anchor
        -> optional target anchor
        -> viewer source
        -> timing
        -> step function
    -> RunningEffect
```

Use `EffectExecutor` when an effect should render repeatedly on the Bukkit scheduler.

Use `PaperEffectHandler` when you want convenience methods such as `playAt(...)`, `playBetweenPoints(...)`, or `playBetweenEntities(...)`.

## Configuration Layer

The configuration layer is optional.

```text
Bukkit ConfigurationSection
    -> EffectConfigParser
    -> EffectBuilder or EffectInstance
```

The parser is registry-based. Spellbook provides built-in parsers for its built-in configurable components, and plugin code can register custom parsers for additional component types.

