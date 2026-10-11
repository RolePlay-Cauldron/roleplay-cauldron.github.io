---
title: Editor wand
description: Place nodes, connect them and edit edges with the Brotkrumen Wand instead of commands.
---

The **Brotkrumen Wand** lets you build and adjust graphs with clicks instead of typing commands over and over. It is only available while you are in an editor session.

The wand has two modes:

- **Crumb** places nodes and selects nodes or edges. This is the default.
- **Thread** connects selected nodes and edits the type, state and traversal of selected edges.

Warps and teleport edges between graphs stay command-based (`/bkeditor warp ...` and `/bkeditor edge ...`). The wand can only select the node those commands should act on.

---

## Getting the wand

- When you start an editor session with `/bkeditor create` or `/bkeditor edit`, you receive a wand automatically (configurable with `wand.giveOnSessionStart`).
- Use `/bkeditor wand` at any time during a session to get one. If you are not editing, you get an error. If you already carry a wand, you get a message instead of a second one.
- The wand is removed when the session finishes, is cancelled, or you disconnect.

The wand is recognised by a hidden marker, not by its name. Renaming another item to look like the wand does not turn it into one.

---

## Switching modes

Sneak and left-click in the air to switch between Crumb and Thread. The action bar shows the new mode, and the wand's item name and lore show it as well.

Sessions always start in Crumb mode. The mode belongs to the session and is not kept for later sessions.

---

## Crumb mode

| Action | What it does |
| --- | --- |
| Right-click a block | Places a node on top of the clicked block and connects it to the previously placed node, like `/bkeditor place`. |
| Sneak + right-click | Undoes the last node. |
| Left-click a block | Selects the nearest node near the clicked block. If there is no node, the nearest edge is selected instead. This does not change where the next node is appended. |
| Sneak + left-click in the air | Switches to Thread mode. |

If no node or edge is close to the clicked block, you are told that nothing was found nearby.

---

## Thread mode

| Action | What it does |
| --- | --- |
| Left-click a block | Selects the nearest node near the clicked block, otherwise the nearest edge. |
| Right-click a block (two nodes selected, no edge selected) | Creates an edge between the two selected nodes using `wand.defaultEdgeType`. |
| Right-click a block (edge selected) | Changes the active property of the selected edge to its next value. Works for inter-graph edges too. |
| Right-click in the air | Advances the property cursor to the next edge property. |
| Sneak + right-click | Removes the selected edge, or deletes the selected node. |
| Sneak + left-click in the air | Switches to Crumb mode. |

Right-clicking a block with only one node selected tells you to select a second node. With nothing selected, you are told so.

### The property cursor

Right-clicking in the air cycles which edge property the wand changes:

1. Edge type (`directed` / `undirected`)
2. Edge state (`open` / `blocked`)
3. Traversal (`normal` / `teleport`)

After traversal it wraps back to edge type. The action bar names the active property. Right-clicking a block with an edge selected then toggles that property.

### Removing things

Sneak + right-click removes the selected edge. If a node is selected instead, it deletes that node, following the same rules as `/bkeditor delete node`. Only nodes of the active graph can be deleted this way.

---

## Example

Build a route, then fix it up.

```txt
/bkeditor create market_street
/bkeditor preview
```

1. In Crumb mode, right-click the ground along the street to place nodes. Sneak + right-click removes a misplaced node.
2. Sneak + left-click in the air to switch to Thread mode.
3. Left-click a node, then left-click a second node. Right-click a block to connect them with an edge.
4. Left-click the new edge to select it. Right-click in the air until the action bar shows the edge state, then right-click a block to set the edge to `blocked`.
5. Sneak + right-click removes the selected edge if you no longer want it.

```txt
/bkeditor finish
```

---

## Configuration

The wand is configured in the `wand` section of `config.yml`. See also the [configuration reference](/brotkrumen/settings/config/#editor-wand).

| Option | Default | Description |
| --- | --- | --- |
| `wand.giveOnSessionStart` | `true` | Gives a wand automatically when an editor session starts. |
| `wand.material` | `BREAD` | Item material of the wand. Invalid values fall back to `BREAD`. |
| `wand.offsetFromSideFace` | `false` | When `true`, right-clicking the side of a block places the node next to that side instead of on top. |
| `wand.defaultEdgeType` | `undirected` | Edge type used when the wand connects two selected nodes in Thread mode. Either `undirected` or `directed`. |
| `wand.feedback.sounds` | `false` | Plays a sound on successful wand clicks. |
| `wand.feedback.particles` | `false` | Shows particles on successful wand clicks. |

---

## Tips and limitations

- Wand clicks ignore the configured node distance and `editor.placeNodesOnGround`. The node goes where you click.
- When editing an existing graph, placing requires an append anchor, exactly like `/bkeditor place`. Select or walk through a node first.
- Automatic placement while walking still applies if the session placement mode is `auto`. If you only want to place nodes with the wand, switch to preview mode with `/bkeditor preview`.
- Thread mode never places nodes.
- Selection works the same as `/bkeditor select`, so a selected node or edge can also be used with the `/bkeditor edge`, `/bkeditor delete node`, `/bkeditor warp selected` and `/bkeditor selection` commands.
