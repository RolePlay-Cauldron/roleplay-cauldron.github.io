---
title: Configuration
description: Brotkrumen config.yml reference
---

Brotkrumen stores its main settings in `config.yml`. Most servers can start with the defaults and only adjust storage or visual preferences later.

## Localization

```yml
localization:
  defaultLocale: 'en-US'
```

| Option | Default | Description |
| --- | --- | --- |
| `localization.defaultLocale` | `en-US` | Locale used for player and console feedback. Brotkrumen ships with bundled language files and can load custom files from the plugin data `language/` folder. |

## Data storage

```yml
data:
  storageMethod: 'sqlite'
  tablePrefix: 'brotkrumen'
  host: 'localhost'
  port: 3306
  database: 'minecraft'
  user: 'user'
  password: 'pw'
```

| Option | Default | Description |
| --- | --- | --- |
| `data.storageMethod` | `sqlite` | Storage backend. Supported values are `sqlite`, `mysql`, and `mariadb`. |
| `data.tablePrefix` | `brotkrumen` | Prefix for generated database tables. Changing this later does not rename existing tables. |
| `data.host` | `localhost` | Remote database host for MySQL or MariaDB. |
| `data.port` | `3306` | Remote database port. |
| `data.database` | `minecraft` | Database name. Remote databases must already exist before plugin startup. |
| `data.user` | `user` | Remote database username. |
| `data.password` | `pw` | Remote database password. |

### Connection pool

```yml
data:
  poolSettings:
    maximumPoolSize: 10
    minimumIdle: 10
    maximumLifetime: 1800000
    keepAliveTime: 0
    connectionTimeout: 5000
```

These values only apply to MySQL and MariaDB. Leave them unchanged unless you are tuning a known database connection issue.

## Visualizer

```yml
visualizer:
  defaultRenderer: 'spellbookEffect'
  defaultSpellbookEffectPreset: 'ember'
  defaultBlockDisplayPreset: 'ember'
  viewDistance: 26.0
  spawnDistanceBuffer: 32.0
```

| Option | Default | Description |
| --- | --- | --- |
| `visualizer.defaultRenderer` | `spellbookEffect` | Renderer used by editor previews and `/bk resolve`. Supported values are `spellbookEffect` and `blockDisplay`. |
| `visualizer.defaultSpellbookEffectPreset` | `ember` | Default particle/effect preset when a graph has no Spellbook effect preset. |
| `visualizer.defaultBlockDisplayPreset` | `ember` | Default block-display preset when a graph has no block-display preset. |
| `visualizer.viewDistance` | `26.0` | Distance in blocks where graph nodes and edges are rendered visibly. |
| `visualizer.spawnDistanceBuffer` | `32.0` | Extra spawn and retention range for block-display entities. Spellbook effect rendering ignores this buffer. |

### Guided path window

```yml
visualizer:
  guidedPath:
    windowSize: 4
    lookBehind: 1
    keepLookBehindOnCompletion: false
```

| Option | Default | Description |
| --- | --- | --- |
| `visualizer.guidedPath.windowSize` | `4` | Number of forward path nodes shown from the current progress node. |
| `visualizer.guidedPath.lookBehind` | `1` | Number of previous path nodes kept visible behind the player. |
| `visualizer.guidedPath.keepLookBehindOnCompletion` | `false` | Keeps previous nodes visible after the final goal node is reached. |

## Resolve command

```yml
commands:
  resolve:
    nearestNodeRadius: 15.0
    finishRadius: 4.0
    finishCleanupDelaySeconds: 5
    goalMarkerEnabled: true
    teleportRules: 'LOCAL_INTERGRAPH_WARP'
```

| Option | Default | Description |
| --- | --- | --- |
| `commands.resolve.nearestNodeRadius` | `15.0` | Search radius used to find the player's nearest graph node. Clamped to `visualizer.viewDistance` at runtime. |
| `commands.resolve.finishRadius` | `4.0` | Distance used to detect when guided resolve reaches the final path node. |
| `commands.resolve.finishCleanupDelaySeconds` | `5` | Delay before completed resolve visualization is removed. |
| `commands.resolve.goalMarkerEnabled` | `true` | Marks the final selected path node with a dedicated visual role. |
| `commands.resolve.teleportRules` | `LOCAL_INTERGRAPH_WARP` | Default traversal rules for teleport-like path segments. |

Supported teleport rule presets:

| Rule | Meaning |
| --- | --- |
| `DISABLED` | No teleportation allowed. |
| `LOCAL_TP_ONLY` | Only local graph teleports allowed. |
| `WARPS_ONLY` | Only managed warps allowed. |
| `INTERGRAPH_TP_ONLY` | Only inter-graph teleports allowed. |
| `LOCAL_INTERGRAPH_TP` | Local and inter-graph teleports allowed. |
| `LOCAL_TP_WARP` | Local teleports and warps allowed. |
| `INTERGRAPH_WARP` | Inter-graph teleports and warps allowed. |
| `LOCAL_INTERGRAPH_WARP` | Local teleports, inter-graph teleports, and warps allowed. |

### Completion feedback

```yml
commands:
  resolve:
    goal:
      message:
        enabled: true
      sound:
        enabled: true
        name: 'entity.player.levelup'
        volume: 1.0
        pitch: 1.0
      title:
        enabled: false
        fadeInTicks: 10
        stayTicks: 40
        fadeOutTicks: 10
```

These settings control the feedback played when a guided path reaches its final node.

### Away cancellation

```yml
commands:
  resolve:
    cancelWhenAway:
      enabled: true
      distance: 10.0
      warningEnabled: true
      warningGraceSeconds: 5
```

When enabled, Brotkrumen warns players who leave the guided route and cancels guidance if they stay away after the grace period.

### Automatic teleport

```yml
commands:
  resolve:
    autoTeleport:
      enabled: true
      delaySeconds: 3
      messageEnabled: true
      cooldownSeconds: 3
      cancelWhenPlayerMovesAway: true
      cancelRange: 5.0
      localTeleportEnabled: true
      interGraphTeleportEnabled: true
      warpEnabled: true
      startFromWarpWhenNoNearbyNode: true
```

Automatic teleport only executes teleport-like segments that are already part of the selected path. It does not enable traversal types disabled by `commands.resolve.teleportRules` or a `/bk resolve teleport:<rules>` override.

## Editor

```yml
editor:
  defaultNodeDistance: 10
  defaultPlacementMode: 'auto'
  defaultEditPlacementMode: 'preview'
  placeNodesOnGround: false
  continueRequiresNode: true
  defaultPreset: 'ember'
```

| Option | Default | Description |
| --- | --- | --- |
| `editor.defaultNodeDistance` | `10` | Distance in blocks between automatically created editor nodes. |
| `editor.defaultPlacementMode` | `auto` | Default placement mode for new editor sessions. Supported values are `auto`, `preview`, and `waiting-for-anchor`. |
| `editor.defaultEditPlacementMode` | `preview` | Placement mode used when editing an existing graph. |
| `editor.placeNodesOnGround` | `false` | Places new nodes at the highest block at the player's X/Z position instead of the exact player location. |
| `editor.continueRequiresNode` | `true` | Requires walking through a node before automatic placement resumes after undo. |
| `editor.defaultPreset` | `ember` | Temporary editor preview preset selected when a session starts. |
