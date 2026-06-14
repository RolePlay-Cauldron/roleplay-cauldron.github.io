---
title: Effect Config Format
description: Reference for the built-in Spellbook effect configuration keys.
---

# Effect Config Format

The default parser reads one Bukkit `ConfigurationSection` as one complete effect.

## Required Sections

```yaml
shape:
  type: line
  points: 8

particle:
  type: flame
```

`shape` must contain a registered shape `type`.

`particle.type` must be a Bukkit `Particle` name. Names are case-insensitive and can use dashes instead of enum underscores.

## Standard Particle Fields

```yaml
particle:
  type: flame
  count: 3
  offset-x: 0.1
  offset-y: 0.2
  offset-z: 0.1
  extra: 0.0
```

Supported fields:

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `type` | yes | none | Bukkit particle enum name |
| `count` | no | `1` | particle count per emitted point |
| `offset-x` | no | `0.0` | Bukkit particle X offset |
| `offset-y` | no | `0.0` | Bukkit particle Y offset |
| `offset-z` | no | `0.0` | Bukkit particle Z offset |
| `extra` | no | `0.0` | Bukkit particle extra value |
| `data` | no | none | advanced particle data parsed by a registered particle-data parser |

Advanced particle data such as dust, block data, or item data is not parsed by default. Register a `ParticleDataConfigParser` when your plugin needs those values.

## Built-In Shapes

### Line

```yaml
shape:
  type: line
  points: 16
```

Fields:

| Field | Required | Meaning |
| --- | --- | --- |
| `points` | yes | number of points in the line |

### Sphere

```yaml
shape:
  type: sphere
  radius: 1.5
  points: 64
  angular-speed: 0.05
```

Fields:

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `radius` | yes | none | sphere radius |
| `points` | yes | none | number of generated points |
| `angular-speed` | no | `0.0` | frame-based rotation speed |

### Cube

```yaml
shape:
  type: cube
  size: 2.0
  points-per-edge: 6
```

Fields:

| Field | Required | Meaning |
| --- | --- | --- |
| `size` | yes | cube side length |
| `points-per-edge` | yes | number of points generated on each edge |

### Helix

```yaml
shape:
  type: helix
  strands: 2
  particles-per-strand: 32
  radius: 1.0
  height: 3.0
  turns: 2.0
  rotation-speed: 0.1
```

Fields:

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `strands` | yes | none | number of helix strands |
| `particles-per-strand` | yes | none | points generated per strand |
| `radius` | yes | none | helix radius |
| `height` | yes | none | helix height |
| `turns` | yes | none | number of turns |
| `rotation-speed` | no | `0.0` | frame-based rotation speed |

### Spiral Helix

```yaml
shape:
  type: spiral-helix
  strands: 2
  particles-per-strand: 32
  radius: 1.0
  height: 3.0
  curve: 1.5
  rotation-speed: 0.1
  reverse: false
```

Fields:

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `strands` | yes | none | number of strands |
| `particles-per-strand` | yes | none | points generated per strand |
| `radius` | yes | none | spiral radius |
| `height` | yes | none | spiral height |
| `curve` | yes | none | spiral curve factor |
| `rotation-speed` | no | `0.0` | frame-based rotation speed |
| `reverse` | no | `false` | reverses spiral direction |

### Moving Point

```yaml
shape:
  type: moving-point
  speed: 0.5
  spacing: 0.25
  amount-points: 3
  ping-pong: true
```

Fields:

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `speed` | yes | none | movement speed |
| `spacing` | yes | none | distance between generated moving points |
| `amount-points` | yes | none | number of generated moving points |
| `ping-pong` | no | `false` | moves back and forth instead of wrapping |

## Built-In Transforms

Transforms are applied in list order.

```yaml
transforms:
  - type: translate
    x: 0
    y: 1
    z: 0
  - type: rotate
    yaw: 45
    pitch: 0
    roll: 0
```

### Translate

```yaml
- type: translate
  x: 0
  y: 1
  z: 0
```

`x`, `y`, and `z` are required.

### Rotate

```yaml
- type: rotate
  yaw: 45
  pitch: 0
  roll: 0
```

`yaw`, `pitch`, and `roll` are optional and default to `0.0`.

### Look At

```yaml
- type: look-at
  forward-axis:
    x: 0
    y: 0
    z: 1
```

`forward-axis` is optional. When present, `x`, `y`, and `z` are required inside it.

## Built-In Directions

```yaml
direction:
  type: none
```

Supported direction providers:

| Type | Meaning |
| --- | --- |
| `none` | always emits a zero direction vector |
| `toward-target` | points from the effect origin toward the render target, or zero when no target exists |

