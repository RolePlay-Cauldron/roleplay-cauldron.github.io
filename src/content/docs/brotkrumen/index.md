---
title: Brotkrumen
description: Pathfinding using graph theory
---

:::danger[Early Alpha]
Brotkrumen is currently in early `ALPHA` and may contain bugs or unexpected behavior.

The **API is experimental** and is expected to change throughout the alpha phase.

Use at your **own** risk.
:::

## Overview

Brotkrumen is a Minecraft [Paper](https://papermc.io/) plugin designed to guide players through the world by visualizing the shortest path between two points.

The plugin uses graph theory to calculate routes through one or more predefined graphs. These graphs are created in advance by players or server administrators and can represent roads, paths, buildings, regions, transport links, or other navigable structures.

This makes Brotkrumen useful for servers that want to help players navigate large cities, roleplay maps, adventure worlds, quest areas, hub systems, or guided tours.

## How it works

Brotkrumen does not scan the entire Minecraft world automatically. Instead, it relies on graph networks that describe possible routes through the world.

These graphs are defined with the in-game editor. With the editor, you can walk through the world, place nodes at important locations, connect them with edges, mark teleport traversal, set edge state, reference other graphs, and define managed warps.

A graph consists of:

- **Nodes**: important positions in the world, such as crossroads, entrances, shops, landmarks, or region transitions
- **Edges**: connections between nodes that players can walk along or traverse through teleport-like movement
- **Weights**: costs that influence which route is considered shortest or most efficient
- **Warps**: managed named locations that can participate in routing when allowed by teleport rules

Multiple graphs can be created for different areas, worlds, buildings, regions, or logical sections of a server. These graphs can also be connected with **inter-graph edges**.

Inter-graph edges allow Brotkrumen to search across multiple connected graphs as if they were part of one larger navigation network. This makes it possible to split complex servers into smaller, manageable graphs while still allowing paths to be calculated between locations in different graphs.

When a player requests a path, Brotkrumen calculates the shortest route between the selected start and target points. If the start and target are located in different graphs, the search algorithm can traverse connected graphs through inter-graph edges and find a valid route across the graph network.

The resulting path is then displayed using the configured renderer and visual preset.

## Visual rendering

Brotkrumen supports two renderer families for displaying graphs and guided paths.

### Spellbook effect renderer

The Spellbook effect renderer displays the calculated route through particle/effect designs from `presets.yml`.

This renderer is lightweight and works well for temporary navigation such as quests, shops, regions, event locations, or other points of interest.

### Block display renderer

The block-display renderer visualizes the route using temporary Minecraft Block Display entities.

Instead of modifying real blocks in the world, this renderer displays temporary visual block elements along the path. It is useful in areas where particles may be harder to notice, such as crowded hubs, visually busy builds, or tutorial areas.

## Guided resolve

Players can be guided with `/bk resolve`. The command can target a graph or one or more node ids, and it can optionally override teleport rules for a single request.

Guided resolve can:

- show a moving window of upcoming path nodes
- keep a configurable look-behind section visible
- mark the final goal node
- automatically execute selected local teleport, inter-graph teleport, or warp segments
- warn and cancel when a player stays too far away from the route
- play completion messages, sounds, or titles

## Storage and customization

Brotkrumen uses SQLite by default and can also use MySQL or MariaDB for remote storage. Visual presets are loaded from `presets.yml`, while command messages are loaded from localization files under `language/`.

## Use Cases

Brotkrumen can be used in many different situations, including:

- guiding new players through a server hub
- showing the shortest route to shops, NPCs, quests, or event areas
- helping players navigate large cities or roleplay maps
- creating guided tours through builds
- connecting important landmarks with predefined paths
- improving navigation in complex adventure maps or minigame lobbies

## Requirements

Before Brotkrumen can calculate useful paths, a graph must be created for the relevant world or region. Without a graph, the plugin does not know which paths are valid and cannot calculate meaningful routes.
