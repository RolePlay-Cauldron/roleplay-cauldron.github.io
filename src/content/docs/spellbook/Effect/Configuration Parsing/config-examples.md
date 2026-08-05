---
title: Effect Config Examples
description: Ready-to-copy YAML examples for Spellbook effect configs.
---

# Effect Config Examples

These examples are complete effect sections. Put them under any path your plugin reads as a Bukkit `ConfigurationSection`.

```java
ConfigurationSection section = getConfig().getConfigurationSection("effects.fire-sphere");
EffectInstance effect = EffectConfigParser.defaults().parse(section);
```

## Fire Sphere

```yaml
effects:
  fire-sphere:
    shape:
      type: sphere
      radius: 1.5
      points: 64
      angular-speed: 0.04

    particle:
      type: flame
      count: 1
      offset-x: 0.02
      offset-y: 0.02
      offset-z: 0.02
      extra: 0.0
```

## Rising Flame Line

This fixed-count line always emits twelve sampled points.

```yaml
effects:
  rising-flame-line:
    shape:
      type: line
      points: 12

    particle:
      type: flame
      count: 2
      offset-x: 0.05
      offset-y: 0.05
      offset-z: 0.05
      extra: 0.01

    transforms:
      - type: translate
        x: 0
        y: 1.25
        z: 0
```

## Targeted Spaced Line

This distance-based line adapts to the target distance while limiting each frame to 512
points. It includes both the origin and target endpoints.

```yaml
effects:
  targeted-spaced-line:
    shape:
      type: line
      spacing: 0.5
      max-points: 512

    particle:
      type: end-rod
      count: 1
```

## Rotating Helix

```yaml
effects:
  rotating-helix:
    shape:
      type: helix
      strands: 2
      particles-per-strand: 32
      radius: 1.0
      height: 2.5
      turns: 2.0
      rotation-speed: 0.08

    particle:
      type: end-rod
      count: 1
      extra: 0.0

    transforms:
      - type: translate
        x: 0
        y: 1.0
        z: 0
      - type: rotate
        yaw: 0
        pitch: 0
        roll: 0
```

## Targeted Spiral

Use `direction.type: toward-target` when the render context includes a target location and the effect should orient toward it.

```yaml
effects:
  targeted-spiral:
    shape:
      type: spiral-helix
      strands: 1
      particles-per-strand: 40
      radius: 0.75
      height: 3.0
      curve: 1.25
      rotation-speed: 0.05
      reverse: false

    particle:
      type: crit
      count: 1

    direction:
      type: toward-target

    transforms:
      - type: look-at
```

## Morphing Sphere To Cube

Morph shapes parse nested `source` and `target` shapes recursively. Any registered shape type can be used there.

```yaml
effects:
  sphere-to-cube:
    shape:
      type: morph
      source:
        type: sphere
        radius: 1.2
        points: 48
      target:
        type: cube
        size: 2.0
        points-per-edge: 5
      progress:
        type: over-steps
        duration-steps: 40
      strategy: resample-to-max

    particle:
      type: electric-spark
      count: 1
```

## Delayed Morph

```yaml
effects:
  delayed-morph:
    shape:
      type: morph
      source:
        type: line
        points: 24
      target:
        type: sphere
        radius: 1.0
        points: 48
      progress:
        type: after-seconds
        start-seconds: 1.0
        duration-seconds: 2.5
      strategy: resample-source-to-target

    particle:
      type: happy-villager
      count: 1
      offset-x: 0.01
      offset-y: 0.01
      offset-z: 0.01
```

## Moving Point Trail

```yaml
effects:
  moving-point-trail:
    shape:
      type: moving-point
      speed: 0.4
      spacing: 0.3
      amount-points: 5
      ping-pong: true

    particle:
      type: soul-fire-flame
      count: 1

    transforms:
      - type: translate
        x: 0
        y: 0.75
        z: 0
```

