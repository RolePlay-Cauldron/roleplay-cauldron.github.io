---
title: Custom Components
description: Extend Spellbook effects with custom shapes, transforms, modifiers, emitters, and directions.
---

# Custom Components

The effect engine is built around small functional interfaces.

## Custom Shape

Implement `Shape` to write local-space points.

```java
public final class RingShape implements Shape {
    private final float radius;
    private final int points;

    public RingShape(float radius, int points) {
        this.radius = radius;
        this.points = points;
    }

    @Override
    public void sample(ShapeContext context, PointBuffer buffer) {
        buffer.ensureCapacity(buffer.size() + points);

        for (int i = 0; i < points; i++) {
            double angle = Math.PI * 2.0 * i / points;
            buffer.add(
                    (float) Math.cos(angle) * radius,
                    0,
                    (float) Math.sin(angle) * radius
            );
        }
    }
}
```

Shapes append points. They should not clear the output buffer.

## Custom Transform

Implement `Transform` to mutate each point.

```java
Transform stretchY = (points, index, context) -> {
    points.setY(index, points.y(index) * 2.0f);
};
```

For transforms that need expensive per-frame setup, override `prepare(...)`.

```java
public final class TimeWaveTransform implements Transform {
    @Override
    public PreparedTransform prepare(EffectContext context) {
        float phase = (float) context.timeSeconds();

        return (points, index) -> {
            float y = points.y(index) + (float) Math.sin(points.x(index) + phase);
            points.setY(index, y);
        };
    }

    @Override
    public void apply(PointBuffer points, int index, EffectContext context) {
        prepare(context).apply(points, index);
    }
}
```

`prepare(...)` is called once per transform per render frame. The returned operation is then applied to every point.

## Custom Modifier

Use `EffectModifier` when the operation needs the whole point buffer.

```java
EffectModifier removeLowerHalf = (points, context) -> {
    for (int i = points.size() - 1; i >= 0; i--) {
        if (points.y(i) < 0) {
            points.removeUnordered(i);
        }
    }
};
```

Modifiers run after transforms and before emitters.

## Custom Particle Emitter

Implement `ParticleEmitter` when Bukkit's standard particle call is not enough.

```java
ParticleEmitter directionalEmitter = new ParticleEmitter() {
    @Override
    public boolean requiresDirection() {
        return true;
    }

    @Override
    public void spawn(
            EffectContext context,
            float localX,
            float localY,
            float localZ,
            double worldX,
            double worldY,
            double worldZ,
            float directionX,
            float directionY,
            float directionZ
    ) {
        Location location = new Location(context.world(), worldX, worldY, worldZ);

        for (Player viewer : context.viewers()) {
            viewer.spawnParticle(
                    Particle.CLOUD,
                    location,
                    0,
                    directionX,
                    directionY,
                    directionZ,
                    0.2
            );
        }
    }
};
```

Return `false` from `requiresDirection()` when your emitter ignores direction. This avoids per-point direction calculations.

## Custom Direction Provider

Direction providers populate a reusable destination vector.

```java
DirectionProvider outward = (localX, localY, localZ, context, destination) -> {
    destination.set(localX, localY, localZ);
    if (destination.lengthSquared() > 1.0e-6f) {
        destination.normalize();
    }
};
```

Direction providers only run for emitters whose `requiresDirection()` returns `true`.

## Custom Viewer Source

Viewer sources can be static or dynamic.

```java
ViewerSource nearbyViewers = () -> origin.getWorld().getPlayers().stream()
        .filter(player -> player.getLocation().distanceSquared(origin) <= 32 * 32)
        .toList();
```

`EffectExecutor` resolves the viewer source each frame.

## Custom Anchor

Anchors can resolve any dynamic location source.

```java
EffectAnchor offsetEntityAnchor = () -> {
    if (!entity.isValid()) {
        return null;
    }
    return entity.getLocation().add(0, 1.5, 0);
};
```

Returning `null` lets the executor skip or cancel the frame depending on the execution config.

