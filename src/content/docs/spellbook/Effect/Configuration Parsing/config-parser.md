---
title: Effect Config Parser
description: Parse Bukkit configuration sections into Spellbook particle effects.
---

# Effect Config Parser

`EffectConfigParser` turns a Bukkit `ConfigurationSection` into a Spellbook `EffectBuilder` or `EffectInstance`.

Use it when your plugin wants to define particle effects in YAML while still using Spellbook's Java effect pipeline at runtime.

```java
ConfigurationSection section = getConfig().getConfigurationSection("effects.fire-ring");

EffectInstance effect = EffectConfigParser.defaults().parse(section);
```

`EffectConfigParser.defaults()` creates a parser with Spellbook's built-in shapes, transforms, and direction providers registered. The parser instance is independent, so plugin code can add custom parsers without changing global behavior.

## Parsing Modes

Use `parse(section)` when the configuration is the full effect definition and you want an `EffectInstance` immediately.

```java
EffectInstance effect = EffectConfigParser.defaults().parse(section);
```

Use `parseBuilder(section)` when configuration should provide the base effect, but Java code still needs to add runtime-only behavior before building.

```java
EffectBuilder builder = EffectConfigParser.defaults().parseBuilder(section);

EffectInstance effect = builder
        .modifier((points, context) -> {
            // Add runtime-only modification here.
        })
        .build();
```

## Top-Level Shape

Every effect config has two required sections:

- `shape`: where local effect points are created
- `particle`: which Bukkit particle is emitted for each point

Optional sections are:

- `transforms`: ordered list of point transforms
- `modifiers`: ordered list of point-buffer modifiers
- `direction`: direction provider used by direction-aware rendering

```yaml
shape:
  type: sphere
  radius: 1.5
  points: 64

particle:
  type: flame
  count: 1

transforms:
  - type: translate
    x: 0
    y: 1
    z: 0

direction:
  type: none
```

All polymorphic sections use a required `type` key. Type names are case-insensitive, and underscores are treated like dashes, so `spiral_helix` and `spiral-helix` resolve to the same built-in type.

## Error Messages

Invalid configuration throws `EffectConfigException`. Errors include the relevant configuration path where possible.

Examples:

- missing `shape` reports `shape`
- missing shape type reports `shape.type`
- missing nested morph target fields can report paths such as `shape.target.points`
- invalid numeric values can report paths such as `shape.points` or `particle.count`
- scalar values where sections are required can report paths such as `direction`
- unknown component types include the registered type names

Use `path()` and `detail()` when reporting startup failures to server administrators.

```java
try {
    EffectInstance effect = EffectConfigParser.defaults().parse(section);
} catch (EffectConfigException exception) {
    getLogger().warning("Invalid effect config at " + exception.path() + ": " + exception.detail());
}
```

This makes it suitable to catch parser failures during plugin startup and report exact YAML paths to server administrators.
