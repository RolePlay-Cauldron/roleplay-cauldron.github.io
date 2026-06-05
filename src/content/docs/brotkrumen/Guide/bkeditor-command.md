---
title: bkeditor command
description: An explanation guide of the `/bkeditor` command and its subcommands.
---

# `/bkeditor`

The `/bkeditor` command is Brotkrumen's in-game graph editing toolkit.  
Use it to create routes, place nodes, connect edges, manage selections, preview reference graphs, and define managed warps.

> Most editor actions are **player-only**, because they depend on your current location, view, selection, or active editor session.

---

## At a glance

```txt
/bkeditor create <name>
/bkeditor edit <graphName>
/bkeditor rename <newName>
/bkeditor finish
/bkeditor cancel

/bkeditor preview
/bkeditor place
/bkeditor continue
/bkeditor undo [amount]

/bkeditor settings show
/bkeditor settings node-distance <blocks>
/bkeditor settings placement <mode>
/bkeditor settings continue-requires-node <enabled>
/bkeditor settings preset <presetName>

/bkeditor view add <graphName>
/bkeditor view remove <graphName>
/bkeditor view clear

/bkeditor select node
/bkeditor select edge
/bkeditor selection show
/bkeditor selection clear
/bkeditor selection connections
/bkeditor selection teleport

/bkeditor edge connect <type>
/bkeditor edge traversal <traversal>
/bkeditor edge state <state>
/bkeditor edge remove

/bkeditor delete node
/bkeditor delete graph <graphName>

/bkeditor warp selected <key>
/bkeditor warp here <key>
/bkeditor warp remove <key>
/bkeditor warp list
/bkeditor warp list all
/bkeditor warp set cost <key> <cost>
/bkeditor warp set enabled <key> <enabled>
/bkeditor warp set permission <key> <required>
```

---

## The editor flow

A typical editing session looks like this:

```txt
/bkeditor create forest_path
/bkeditor preview
/bkeditor place
/bkeditor continue
/bkeditor place
/bkeditor finish
```

Think of the editor as a small workspace attached to your player:

1. **Open a session** with `create` or `edit`.
2. **Place nodes** at your current position.
3. **Connect and tune edges** when needed.
4. **Preview or reference other graphs** while building.
5. **Finish** to persist your graph, or **cancel** to discard the active session.

---

## Session commands

These commands control the lifecycle of your active editor session.

| Command | What it does |
| --- | --- |
| `/bkeditor create <name>` | Starts a new graph editing session with the given graph name. |
| `/bkeditor edit <graphName>` | Opens an existing graph for editing. Graph names are suggested through tab completion. |
| `/bkeditor rename <newName>` | Renames the currently active graph. |
| `/bkeditor finish` | Finishes the active route creation/editing session and saves the result. |
| `/bkeditor cancel` | Cancels the active editor session. |

### Examples

```txt
/bkeditor create spawn_to_market
/bkeditor edit spawn_to_market
/bkeditor rename spawn_to_harbor
/bkeditor finish
```

---

## Placement commands

Placement commands help you build the route in-world.

| Command | What it does |
| --- | --- |
| `/bkeditor preview` | Shows a preview of the current editor state. |
| `/bkeditor place` | Places a node at your current location. |
| `/bkeditor continue` | Continues placement from the current editor state. |
| `/bkeditor undo` | Undoes the last editor action. |
| `/bkeditor undo <amount>` | Undoes multiple editor actions. The amount must be at least `1`. |

### Examples

```txt
/bkeditor place
/bkeditor undo
/bkeditor undo 3
```
:::caution[No redo available]
`/bkeditor undo` is destructive for the current editor history.  
There is currently no `/bkeditor redo` command, so only undo changes you are sure you want to roll back.
:::

---

## Editor settings

Editor settings let you adjust how the active editing session behaves.

| Command | What it does |
| --- | --- |
| `/bkeditor settings show` | Displays the current editor settings. |
| `/bkeditor settings node-distance <blocks>` | Sets the preferred distance between placed nodes. The value must be at least `1`. |
| `/bkeditor settings placement <mode>` | Changes the placement mode. Available values are suggested in-game. |
| `/bkeditor settings continue-requires-node <enabled>` | Controls whether `continue` requires a nearby node. Use `true` or `false`. |
| `/bkeditor settings preset <presetName>` | Applies a supported editor preset. Preset names are suggested in-game. |

The default editor settings are loaded from config keys such as:

```yaml
editor:
  defaultNodeDistance: 10
  defaultPlacementMode: auto
  continueRequiresNode: true
  defaultPreset: default
```

### Examples

```txt
/bkeditor settings show
/bkeditor settings node-distance 8
/bkeditor settings continue-requires-node false
/bkeditor settings preset default
```

---

## Reference graph view

The `view` subcommands let you show other graphs as visual references while editing.

| Command | What it does |
| --- | --- |
| `/bkeditor view add <graphName>` | Adds a graph to your reference view. |
| `/bkeditor view remove <graphName>` | Removes a graph from your reference view. |
| `/bkeditor view clear` | Clears all reference graphs from your view. |

### Examples

```txt
/bkeditor view add old_spawn_route
/bkeditor view remove old_spawn_route
/bkeditor view clear
```

---

## Selection commands

Selections are used for node edits, edge edits, teleporting to graph elements, and inspecting connections.

### Select something nearby

| Command | What it does |
| --- | --- |
| `/bkeditor select node` | Selects a nearby node. |
| `/bkeditor select edge` | Selects a nearby edge. |

### Work with the current selection

| Command | What it does |
| --- | --- |
| `/bkeditor selection show` | Shows the current selection. |
| `/bkeditor selection clear` | Clears the current selection. |
| `/bkeditor selection connections` | Lists the selected node's connections. |
| `/bkeditor selection teleport` | Teleports you to the selected element, when possible. |

### Examples

```txt
/bkeditor select node
/bkeditor selection connections
/bkeditor selection teleport
```

---

## Edge commands

Edges connect nodes and define how the graph can be traversed.

| Command | What it does |
| --- | --- |
| `/bkeditor edge connect <type>` | Creates an edge between selected nodes using the given edge type. |
| `/bkeditor edge traversal <traversal>` | Updates traversal behavior for the selected edge. |
| `/bkeditor edge state <state>` | Updates the selected edge state. |
| `/bkeditor edge remove` | Removes the selected edge. |

The available `type`, `traversal`, and `state` values are suggested through tab completion.

### Examples

```txt
/bkeditor edge connect normal
/bkeditor edge traversal bidirectional
/bkeditor edge state enabled
/bkeditor edge remove
```

---

## Delete commands

Use delete commands carefully. They modify graph data directly.

| Command | What it does |
| --- | --- |
| `/bkeditor delete node` | Deletes the currently selected node. |
| `/bkeditor delete graph <graphName>` | Deletes a persisted graph by name. Graph names are suggested in-game. |

### Examples

```txt
/bkeditor delete node
/bkeditor delete graph test_route
```

---

## Warp commands

Managed warps can be attached to selected graph elements or to your current location.

| Command | What it does |
| --- | --- |
| `/bkeditor warp selected <key>` | Creates a warp from the current selection. |
| `/bkeditor warp here <key>` | Creates a warp at your current location. |
| `/bkeditor warp remove <key>` | Removes a managed warp. |
| `/bkeditor warp list` | Lists managed warps for the active context. |
| `/bkeditor warp list all` | Lists all managed warps. |
| `/bkeditor warp set cost <key> <cost>` | Sets the warp cost. The cost must be `0.0` or higher. |
| `/bkeditor warp set enabled <key> <enabled>` | Enables or disables a warp. Use `true` or `false`. |
| `/bkeditor warp set permission <key> <required>` | Controls whether the warp requires permission. Use `true` or `false`. |

### Examples

```txt
/bkeditor warp here harbor
/bkeditor warp selected market_gate
/bkeditor warp set cost harbor 25.0
/bkeditor warp set enabled harbor true
/bkeditor warp set permission harbor true
/bkeditor warp list all
```