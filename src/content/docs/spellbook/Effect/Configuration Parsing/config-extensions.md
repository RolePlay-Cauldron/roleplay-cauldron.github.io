---
title: Extending Effect Configs
description: Register custom shapes, transforms, modifiers, directions, and particle data.
---

# Extending Effect Configs

`EffectConfigParser` uses registries for configurable component types. Start with `defaults()` and register plugin-specific additions on that parser instance.

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerShape("custom-point", (section, context) -> (shapeContext, points) -> {
            points.add(0, 0, 0);
        });
```

The registered type name is normalized. For example, `custom_point`, `Custom-Point`, and `custom-point` all resolve to `custom-point`.

Register each normalized type only once per parser instance. Duplicate registrations throw `IllegalArgumentException`.

## Custom Shape

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerShape("single-point", (section, context) -> (shapeContext, points) -> {
            float x = context.getFloat(section, "x", 0.0f);
            float y = context.getFloat(section, "y", 0.0f);
            float z = context.getFloat(section, "z", 0.0f);

            points.add(x, y, z);
        });
```

```yaml
shape:
  type: single-point
  x: 0
  y: 1
  z: 0

particle:
  type: flame
```

## Custom Transform

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerTransform("vertical-shift", (section, context) -> {
            float y = context.getFloat(section, "y", 1.0f);
            return new TranslateTransform(0, y, 0);
        });
```

```yaml
shape:
  type: line
  points: 8

particle:
  type: flame

transforms:
  - type: vertical-shift
    y: 2.0
```

## Custom Modifier

Modifiers edit the generated point buffer after shapes and transforms have run.

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerModifier("duplicate-offset", (section, context) -> (points, effectContext) -> {
            points.add(1, 0, 0);
        });
```

```yaml
shape:
  type: line
  points: 8

particle:
  type: flame

modifiers:
  - type: duplicate-offset
```

## Custom Particle Data

The default parser only reads flat standard particle fields. Register particle data parsers for advanced Bukkit particle payloads.

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerParticleData("dust-options", (particle, section, context) -> {
            return new Particle.DustOptions(Color.RED, context.getFloat(section, "size", 1.0f));
        });
```

```yaml
shape:
  type: line
  points: 8

particle:
  type: dust
  data:
    type: dust-options
    size: 1.0
```

The object returned by a particle-data parser must match Bukkit's `Particle#getDataType()` for the configured particle.

## Nested Shape Parsing

Custom parsers can use `EffectConfigContext` to parse nested shapes, transforms, modifiers, directions, and particle sections with the same registry and useful error paths.

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerShape("wrapper", (section, context) -> {
            Shape nested = context.parseShape(
                    context.requireSection(section, "child"),
                    context.path("child")
            );

            return (shapeContext, points) -> nested.sample(shapeContext, points);
        });
```

```yaml
shape:
  type: wrapper
  child:
    type: sphere
    radius: 1.0
    points: 32

particle:
  type: flame
```

When a nested shape fails, the exception path points inside the nested section, such as `shape.child.points`.

## Context Field Helpers

Use context helpers for required and optional values so custom parser failures have structured paths and invalid datatypes are rejected consistently.

```java
EffectConfigParser parser = EffectConfigParser.defaults()
        .registerShape("custom-line", (section, context) -> {
            int points = context.requireInt(section, "points");
            float offset = context.getFloat(section, "offset", 0.0f);

            return (shapeContext, buffer) -> {
                for (int i = 0; i < points; i++) {
                    buffer.add(offset + i, 0, 0);
                }
            };
        });
```

```yaml
shape:
  type: custom-line
  points: 8
  offset: 0.5

particle:
  type: flame
```

If `points` is missing, `EffectConfigException.path()` is `shape.points` and `detail()` is `Missing required integer`.
