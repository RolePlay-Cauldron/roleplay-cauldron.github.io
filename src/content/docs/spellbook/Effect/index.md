---
title: Spellbook Effect
description: Build and run Paper particle effects with Spellbook's effect engine.
---

# Spellbook Effect

`spellbook-effect` is the Paper-only module for building reusable particle effects.

The engine is Java-first. You compose an `EffectInstance` from:

- a `Shape`, which samples local-space points
- zero or more `Transform`s, which mutate those points
- zero or more `EffectModifier`s, which edit the whole point buffer
- a `ParticleEmitter`, which emits particles for each final point
- an optional `DirectionProvider`, for emitters that use per-point direction values

```java
EffectInstance effect = EffectBuilder.create()
        .shape(new SphereShape(1.5f, 64, 0.05f))
        .translate(0, 1.0f, 0)
        .particle(Particle.FLAME, 1)
        .build();
```

Effects can be rendered directly for one frame, scheduled with `EffectExecutor`, or loaded from Bukkit configuration through `EffectConfigParser`.

## Module Scope

This module targets Paper/Bukkit particle rendering. It does not provide a standalone plugin, command framework, scheduler abstraction, viewer selection policy, or config file loader.

Consumers usually provide:

- a Paper plugin instance for scheduling
- viewer selection
- origin and target locations
- optional YAML parsing or custom component registries
