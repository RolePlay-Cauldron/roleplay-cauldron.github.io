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

The plugin uses graph theory to calculate the shortest route through one or more predefined graphs. These graphs are created in advance by players or server administrators and can represent roads, paths, buildings, regions, or any other navigable structure in the world.

This makes Brotkrumen useful for servers that want to help players navigate large cities, roleplay maps, adventure worlds, quest areas, or complex hub systems.

## How it works

Brotkrumen does not scan the entire Minecraft world automatically. Instead, it relies on graph networks that describe possible routes through the world.

These graphs are fully defined by players using an intuitive in-game editor. With the editor, you can walk through the world, place nodes at important locations, and connect them to build navigable route networks.

A graph consists of:

- **Nodes**: important positions in the world, such as crossroads, entrances, shops, landmarks, or region transitions
- **Edges**: connections between nodes that players can walk along
- **Weights**: optional costs that influence which route is considered the shortest or most efficient

Multiple graphs can be created for different areas, worlds, buildings, regions, or logical sections of a server. These graphs can also be connected with **intergraph edges**.

Intergraph edges allow Brotkrumen to search across multiple connected graphs as if they were part of one larger navigation network. This makes it possible to split complex servers into smaller, manageable graphs while still allowing paths to be calculated between locations in different graphs.

When a player requests a path, Brotkrumen calculates the shortest route between the selected start and target points. If the start and target are located in different graphs, the search algorithm can traverse connected graphs through intergraph edges and find a valid route across the graph network.

The resulting path is then displayed using one of the available visualization modes.
## Visual Modes

Brotkrumen supports different visual modes for displaying paths to players.  
The available modes are based on Spellbook’s rendering systems and are designed for different levels of visibility and visual presence.

### Particle Path

The particle path mode displays the calculated route using the Particle Engine provided by Spellbook.

Particles are spawned along the path to guide the player toward the target. This mode is lightweight, non-invasive, and works well for temporary navigation such as quests, shops, regions, event locations, or other points of interest.

:::danger[Picture Missing]
Here needs to be a picture
:::

### Block Display Path

The block display path mode visualizes the route using Minecraft Block Display entities.

Instead of modifying real blocks in the world, this mode renders temporary visual block elements along the path. This makes the route highly visible while keeping the actual world unchanged.

It is especially useful in areas where particles may be harder to notice, such as crowded hubs, visually busy builds, or tutorial areas. It can also be a good alternative for players who experience performance issues with particle-heavy effects.

:::danger[Picture Missing]
Here needs to be a picture
:::

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
