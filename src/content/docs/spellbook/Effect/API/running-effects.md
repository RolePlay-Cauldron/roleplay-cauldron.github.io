---
title: Running Effects
description: Schedule repeated Spellbook effects on Paper.
---

# Running Effects

Use `EffectExecutor` to render an effect repeatedly with Bukkit's scheduler.

```java
EffectExecutor executor = new EffectExecutor(plugin);

EffectExecutionConfig config = EffectExecutionConfig.builder()
        .originAnchor(new FixedAnchor(origin))
        .viewerSource(new FixedViewerSource(viewers))
        .periodTicks(1)
        .maxRuns(40)
        .build();

RunningEffect running = executor.start(effect, config);
```

`RunningEffect` wraps the Bukkit task. Call `cancel()` to stop it early.

```java
running.cancel();
```

## Timing

`EffectExecutionConfig` controls scheduling.

| Builder Method | Default | Meaning |
| --- | --- | --- |
| `delayTicks(long)` | `0` | initial scheduler delay |
| `periodTicks(long)` | `1` | ticks between frames |
| `maxRuns(long)` | `-1` | frame count limit, or `-1` for unlimited |

Each rendered frame receives:

- `runIndex`: starts at `0`
- `elapsedTicks`: `runIndex * periodTicks`
- `elapsedSeconds`: `elapsedTicks / 20.0`
- `step`: by default, equal to `runIndex`

## Step Function

Use a custom step function when render progression should not be the same as run index.

```java
EffectExecutionConfig config = EffectExecutionConfig.builder()
        .originAnchor(new FixedAnchor(origin))
        .viewerSource(new FixedViewerSource(viewers))
        .periodTicks(2)
        .maxRuns(60)
        .stepFunction(frame -> (int) (frame.elapsedTicks() / 4))
        .build();
```

Shapes such as rotating spheres, helixes, moving points, and morphs use `ShapeContext.step()` or `ShapeContext.timeSeconds()` to animate.

## Anchors

Anchors resolve locations per frame.

```java
EffectAnchor fixed = new FixedAnchor(location);
EffectAnchor entity = new EntityAnchor(entity);
```

`FixedAnchor` clones the provided location and returns clones on each resolve.

`EntityAnchor` resolves the entity's current location and returns `null` once the entity is invalid.

## Target Locations

Set a target anchor for effects that need an origin-to-target relationship.

```java
EffectExecutionConfig config = EffectExecutionConfig.builder()
        .originAnchor(new EntityAnchor(caster))
        .targetAnchor(new FixedAnchor(targetLocation))
        .viewerSource(new FixedViewerSource(viewers))
        .maxRuns(20)
        .build();
```

Target-aware components include:

- `LineShape`
- `MovingPointShape`
- `LookAtTransform`
- direction providers that use `EffectContext.target()`

## Cancellation Rules

These flags control how unavailable anchors are handled.

| Builder Method | Default | Meaning |
| --- | --- | --- |
| `cancelIfOriginUnavailable(boolean)` | `true` | stop if origin resolves to `null` or has no world |
| `cancelIfTargetUnavailable(boolean)` | `true` | stop if target resolves to `null` or has no world |
| `cancelIfWorldsDiffer(boolean)` | `true` | stop if origin and target are in different worlds |

When the flag is `false`, the executor skips that frame and tries again on the next scheduled run.

## Viewers

`ViewerSource` resolves players per frame.

```java
ViewerSource source = () -> Bukkit.getOnlinePlayers().stream()
        .filter(player -> player.getWorld().equals(origin.getWorld()))
        .toList();
```

`FixedViewerSource` is useful when the viewer collection is known at start time.

```java
new FixedViewerSource(viewers);
```

By default, frames with no viewers are skipped before shape sampling, transforms, modifiers, and emitters run. Use `skipEmptyViewerFrames(false)` if your custom components need to advance even when no one sees the effect.

## PaperEffectHandler

`PaperEffectHandler` is a convenience wrapper around `EffectExecutor`.

```java
EffectHandler handler = new PaperEffectHandler(new EffectExecutor(plugin));

RunningEffect running = handler.playBetweenPoints(
        effect,
        from,
        to,
        viewers,
        EffectExecutionConfig.builder()
                .originAnchor(new FixedAnchor(from))
                .viewerSource(new FixedViewerSource(viewers))
                .periodTicks(1)
                .maxRuns(20)
                .build()
);
```

The handler replaces the origin, target, and viewer source from the provided base config with the method arguments. Use `EffectExecutor` directly when you need fully custom anchors or viewer sources.

