---
title: Permissions
description: All permission nodes of the Brotkrumen commands and subcommands.
---

Brotkrumen commands are protected by permission nodes. **All nodes are limited to operators by default.** Everyone else needs the node granted through a permission plugin such as LuckPerms.

Players without the matching node cannot run a command. Whether it still shows up in tab completion depends on the server and the permission plugin, because the client is only told about the available commands when its command list is sent or refreshed.

---

## Wildcards

Wildcard nodes grant everything below them, including subcommands added in future versions. Wildcards are resolved by your permission plugin (for example LuckPerms); Brotkrumen does not register them with Bukkit.

| Node | Grants |
| --- | --- |
| `brotkrumen.command.*` | All Brotkrumen commands. |
| `brotkrumen.command.bk.*` | All `/bk` subcommands. |
| `brotkrumen.command.bk.list.*` | All `/bk list` subcommands. |
| `brotkrumen.command.bk.resolve.*` | `/bk resolve`, `/bk resolve cancel` and resolving for other players. |

---

## `/bk`

Each subcommand has its own node.

| Node | Command |
| --- | --- |
| `brotkrumen.command.bk.version` | `/bk version` |
| `brotkrumen.command.bk.list.graph` | `/bk list graph` |
| `brotkrumen.command.bk.list.network` | `/bk list network` |
| `brotkrumen.command.bk.reload` | `/bk reload` |
| `brotkrumen.command.bk.resolve` | `/bk resolve <player> <targets>` for yourself |
| `brotkrumen.command.bk.resolve.cancel` | `/bk resolve cancel` for yourself |
| `brotkrumen.command.bk.resolve.others` | `/bk resolve` and `/bk resolve cancel` for a player other than yourself |

`resolve.others` is checked in addition to `resolve` or `resolve.cancel` whenever the target player is not the sender. The console is always allowed.

---

## `/bkeditor`

The whole editor is guarded by one core node.

| Node | Command |
| --- | --- |
| `brotkrumen.command.bkeditor` | `/bkeditor` and all of its subcommands |

Players without this node cannot start an editor session. Because the editor wand only works inside an active session, it needs no node of its own.

---

## Warp permissions

Warp permissions are separate from the command permissions above. They don't decide who may run a command. They decide which managed warps `/bk resolve` may use when it builds a route for a player.

### When a warp needs a permission

**New warps are restricted by default.** A warp created with `/bkeditor warp selected` or `/bkeditor warp here` is only used by `/bk resolve` for players who hold the matching warp permission.

To make a warp usable by everyone, turn the requirement off:

```txt
/bkeditor warp set permission <key> false
```

To restrict it again, run the same command with `true`.

Disabled warps (`/bkeditor warp set enabled <key> false`) are never used, no matter which permissions a player has.

### Which node to grant

A restricted warp accepts either of two nodes. Granting one of them is enough.

| Node | Example |
| --- | --- |
| `brotkrumen.warp.<key>` | `brotkrumen.warp.ship_harbor` for the warp `ship_harbor` |
| `brotkrumen.warp.<target-node-id>` | `brotkrumen.warp.6f9619ff-8b86-d011-b42d-00cf4fc964ff` for the node the warp leads to |

For the key-based node, Brotkrumen lowercases the warp key and replaces spaces with `_`. A warp named `Ship_Harbor` is therefore unlocked by `brotkrumen.warp.ship_harbor`.

Warp keys typed into `/bkeditor` are single words, so they can't contain spaces. Spaces can only appear in keys created by other plugins through the Brotkrumen API. A warp an API created as `Ship Harbor` is unlocked by `brotkrumen.warp.ship_harbor` as well.

The node-id variant is useful when you want to tie the permission to a specific destination node instead of a warp name, for example because the warp key may be renamed later.

To unlock all restricted warps at once, grant `brotkrumen.warp.*`. This wildcard is resolved by your permission plugin.

Like all Brotkrumen nodes, warp nodes are limited to operators by default. Operators can therefore use every restricted warp without further setup.

### Whose permission is checked

Brotkrumen checks the player who is being guided, not the player or console who ran the command. If a moderator runs `/bk resolve Steve graph:spawn`, the route only uses restricted warps that `Steve` may use, even if the moderator could use more.

### What happens without the permission

A restricted warp that the player may not use is simply left out of the route search. The player doesn't get an error. Brotkrumen looks for another route without that warp instead. If no other route exists, the usual "no path found" message is shown.

This also affects the fallback setting `commands.resolve.autoTeleport.startFromWarpWhenNoNearbyNode`. When a player stands far away from every graph, Brotkrumen only considers warps the player may use as a starting point.

Warps only take part in routing at all if the active teleport rules allow them, for example `WARPS_ONLY` or `LOCAL_INTERGRAPH_WARP`. With rules like `DISABLED` or `LOCAL_TP_ONLY`, no warps are used and their permissions don't matter.

### Example

Make the warp `ship_harbor` available to the `sailor` group only. The first command is only needed if the requirement was turned off before, because new warps are restricted anyway:

```txt
/bkeditor warp set permission ship_harbor true
/lp group sailor permission set brotkrumen.warp.ship_harbor true
```

Members of `sailor` can now be routed through the `ship_harbor` warp. Everyone else is guided along a route without it.
