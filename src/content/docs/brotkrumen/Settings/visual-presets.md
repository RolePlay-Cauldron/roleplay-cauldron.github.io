---
title: Visual Presets
description: Configure Brotkrumen path and graph visualization presets
---

Brotkrumen loads visual design profiles from `presets.yml`. Presets define how graph nodes, graph edges, teleports, warps, and guided-path goals are rendered.

The bundled presets are:

| Preset | Description |
| --- | --- |
| `ember` | Warm flame, lava, smoke, and high-contrast block-display materials. |
| `prism` | Brighter end-rod, portal, witch, glass, and sea-lantern styling. |

## Renderer families

Each preset can define designs for two renderer families:

| Renderer | Preset key | Description |
| --- | --- | --- |
| `spellbookEffect` | `particle` | Renders nodes and edges through Spellbook's effect system. |
| `blockDisplay` | `block-display` | Renders temporary Minecraft Block Display entities without changing real world blocks. |

The default renderer is configured in `config.yml`:

```yml
visualizer:
  defaultRenderer: 'spellbookEffect'
```

## Node roles

Node roles let different graph elements use different visuals.

| Role | Meaning |
| --- | --- |
| `DEFAULT` | Normal graph node. |
| `LOCAL_TELEPORT` | Node involved in local teleport traversal. |
| `INTERGRAPH_TELEPORT` | Node involved in inter-graph teleport traversal. |
| `WARP` | Managed warp node. |
| `GUIDED_PATH_GOAL` | Final goal marker for guided `/bk resolve` paths. |

## Edge roles

Edge roles control the visuals for normal, directed, blocked, and inter-graph connections.

| Role | Meaning |
| --- | --- |
| `DEFAULT_LOCAL` | Normal local edge. |
| `DIRECTED_LOCAL` | Directed local edge. |
| `UNDIRECTED_LOCAL` | Undirected local edge. |
| `BLOCKED` | Blocked edge. |
| `INTER_GRAPH` | Inter-graph edge. |
| `DIRECTED_INTER_GRAPH` | Directed inter-graph edge. |
| `UNDIRECTED_INTER_GRAPH` | Undirected inter-graph edge. |

## Particle design

Particle presets define a shape and particle for each role.

```yml
ember:
  particle:
    nodes:
      DEFAULT:
        shape:
          type: cube
          size: 0.45
          points-per-edge: 5
        particle:
          type: FLAME
```

Common shape types include `cube`, `sphere`, `line`, and `moving-point`.

## Block-display design

Block-display presets define a material, scale, thickness, and node clearance.

```yml
ember:
  block-display:
    nodes:
      DEFAULT:
        material: COAL_BLOCK
        scale: 0.45
    edges:
      DEFAULT_LOCAL:
        material: ORANGE_WOOL
        thickness: 0.16
        node-clearance: 0.8
```

Block-display rendering uses `visualizer.viewDistance` plus `visualizer.spawnDistanceBuffer` for entity spawn and retention range.

## Setting graph presets

Use `/bkeditor preset` while editing a graph to store renderer-specific presets on that graph:

```txt
/bkeditor preset spellbookEffect ember
/bkeditor preset blockDisplay prism
```

Use `/bkeditor settings preset <presetName>` when you only want to change the temporary editor preview preset for the active renderer.

## Reloading presets

After editing `presets.yml`, reload Brotkrumen:

```txt
/bk reload
```

This reloads configuration, localization, visual presets, graphs, and graph networks.
