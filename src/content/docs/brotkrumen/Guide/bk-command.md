---
title: bk command
description: An explanation guide of the `/bk` command and its subcommands.
---

The `/bk` command is the public Brotkrumen runtime command group. It is meant for inspecting the installed plugin, reloading runtime data, listing available graph data, and guiding players through graph networks with visual path resolution.

> **Root command:** `/bk`  
> **Registered subcommands:** `version`, `reload`, `list`, `resolve`

---

## Command overview

| Command | Description |
| --- | --- |
| `/bk version` | Shows Brotkrumen diagnostics such as plugin version, server version, storage backend, schema version, and online player count. |
| `/bk reload` | Reloads configuration, localization, visual presets, graphs, and graph networks. |
| `/bk list graph` | Lists all loaded graphs. |
| `/bk list network` | Lists all loaded graph networks. |
| `/bk resolve <player> <targets>` | Calculates and displays a guided path for a player. |
| `/bk resolve cancel` | Cancels your own active resolve guidance session. Player-only shortcut. |
| `/bk resolve cancel <player>` | Cancels another player's active resolve guidance session. |

---

## `/bk version`

Shows a compact diagnostics summary for the running Brotkrumen instance. This is useful for issue reports.

```txt
/bk version
```

### What it shows

- Brotkrumen plugin version
- Server name, server version, and Bukkit version
- Hook information
- Storage backend
- Storage schema version
- Current online player count

The version title is interactive in-game: hovering it shows a hint, and clicking it copies the diagnostics block to the clipboard.

---

## `/bk reload`

Reloads Brotkrumen runtime data without restarting the server.

```txt
/bk reload
```

Reload includes:

- plugin configuration
- localization files
- visual presets
- persisted graphs
- graph networks

The command requires the `brotkrumen.command.bk.reload` permission.

---

## `/bk list`

Lists graph-related runtime data known to Brotkrumen.

### List graphs

```txt
/bk list graph
```

Shows all loaded graphs, sorted by graph database id.

Example output style:

```text
Graphs: 1 spawn, 2 market, 3 mines
```

When no graphs exist, Brotkrumen reports that no graphs are available.

### List networks

```txt
/bk list network
```

Shows all graph networks and summarizes how many graphs and inter-graph edges each network contains.

Example output style:

```text
Network #1: 3 graphs, 4 inter-graph edges; Network #2: 2 graphs, 1 inter-graph edges
```

Use this command to check whether your graphs are connected before trying to resolve paths across them.

---

## `/bk resolve`

The resolve command guides a player from their current nearest graph node to a graph or node target. Brotkrumen finds the nearest node around the player, searches a path through the graph network, and displays the result using the configured visualizer backend.

```txt
/bk resolve <player> <targets>
```

### Arguments

| Argument | Description |
| --- | --- |
| `<player>` | Online player who should receive the guided path. Supports online-player suggestions. |
| `<targets>` | One or more target tokens. This is a greedy argument, so everything after the player name is parsed as target input. |

### Target tokens

Targets are written as prefixed tokens. Long and short prefixes are supported.

| Token | Short form | Meaning |
| --- | --- | --- |
| `graph:<name-or-id>` | `g:<name-or-id>` | Resolve to a graph by name or database id. |
| `node:<uuid>` | `n:<uuid>` | Resolve to a specific node id. Multiple node targets are allowed. |
| `teleport:<rules>` | `tp:<rules>` | Override the configured teleport rules for this resolve request. |

`network:` targets are currently rejected by the parser and are not supported by `/bk resolve`.

### Examples

Resolve a player to a graph by name:

```txt
/bk resolve Steve graph:spawn
```

Resolve a player to a graph by id:

```txt
/bk resolve Steve g:3
```

Resolve a player to a specific node:

```txt
/bk resolve Steve node:6f9619ff-8b86-d011-b42d-00cf4fc964ff
```

Resolve a player to one of several possible nodes:

```txt
/bk resolve Steve node:6f9619ff-8b86-d011-b42d-00cf4fc964ff node:7f9619ff-8b86-d011-b42d-00cf4fc964ff
```

Resolve with a one-off teleport rule override:

```txt
/bk resolve Steve graph:spawn teleport:LOCAL_INTERGRAPH_WARP
```

The shorthand version works too:

```txt
/bk resolve Steve g:spawn tp:LOCAL_INTERGRAPH_WARP
```

---

## Resolve behavior

When `/bk resolve` runs, Brotkrumen does the following:

1. Looks up the target player by the exact chat input name.
2. Parses the target tokens.
3. Takes a snapshot of the player's current location to find the nearest node within the configured nearest node radius.
4. Finds a path to the requested graph or node target.
5. Replaces any previous resolve guidance session for that player.
6. Displays the resulting path using the configured visualizer backend.

If the player is already at the destination graph or target node, the guidance session completes immediately.

When no nearby node is found, Brotkrumen can optionally start from an allowed managed warp if `commands.resolve.autoTeleport.startFromWarpWhenNoNearbyNode` is enabled and the selected teleport rules allow warps.

Guided resolve can also:

- mark the goal node with a dedicated visual role
- play completion messages, sounds, or titles
- automatically execute selected teleport, inter-graph teleport, or warp path segments
- cancel guidance when the player stays too far away from the route

---

## Cancelling resolve guidance

### Cancel your own guidance

```txt
/bk resolve cancel
```

This subcommand only works when the command sender is a player. Console senders must specify a player.

### Cancel another player's guidance

```txt
/bk resolve cancel <player>
```

Example:

```txt
/bk resolve cancel Steve
```

Cancelling removes the player's active resolve guidance visualizer, if one exists.

---

## Teleport rules

Resolve pathfinding can optionally consider teleport-like movement depending on the configured rules or the per-command override.

Suggested rule names include:

| Rule | Meaning |
| --- | --- |
| `DISABLED` | Do not use teleport movement. |
| `LOCAL_TP_ONLY` | Allow local teleport movement only. |
| `WARPS_ONLY` | Allow warp movement only. |
| `INTERGRAPH_TP_ONLY` | Allow inter-graph teleport movement only. |
| `LOCAL_INTERGRAPH_TP` | Allow local and inter-graph teleport movement. |
| `LOCAL_TP_WARP` | Allow local teleport movement and warps. |
| `INTERGRAPH_WARP` | Allow inter-graph teleport movement and warps. |
| `LOCAL_INTERGRAPH_WARP` | Allow local teleport movement, inter-graph teleport movement, and warps. |

Per-command override example:

```txt
/bk resolve Alex graph:market teleport:WARPS_ONLY
```

If no `teleport:` token is supplied, Brotkrumen uses the configured default from `commands.resolve.teleportRules`.
