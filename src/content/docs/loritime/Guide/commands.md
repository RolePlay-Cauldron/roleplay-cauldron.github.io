---
title: 'Commands'
description: 'Commands, permissions, aliases, and time string examples.'
---

LoriTime provides a number of different commands that you can use. This page lists the permissions for each command, so you can manage access to the different functions of the plugin.

## Commands & Permissions
| Command | Aliases | Description | Permission |
|---------|---------|-------------|------------|
| `/loritime` | `lt`, `lorit`, `ltime` | View your online time. | `loritime.see` |
| `/loritime <player>` | `lt`, `lorit`, `ltime` | View the online time of the specified player. | `loritime.see.other` |
| `/loritime [server:<server> \| s:<server>] [<player>]` | `lt`, `lorit`, `ltime` | View online time for one server. | `loritime.see.server` / `loritime.see.server.other` |
| `/loritime [world:<world> \| w:<world>] [server:<server> \| s:<server>] [<player>]` | `lt`, `lorit`, `ltime` | View online time for one world. Without a server flag, LoriTime uses the current backend on a proxy or the configured local server name on standalone backends. | `loritime.see.world` / `loritime.see.world.other` |
| `/loritime [<player>] [time:<range> \| t:<range>] [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `lt`, `lorit`, `ltime` | View online time inside a history window. Single values such as `time:8mo` query from now back to the parsed duration. Ranges such as `time:3d-4w` query from four weeks ago up to three days ago. | Same as the selected global, server, or world lookup plus `loritime.see.timerange` / `loritime.see.timerange.other` |
| `/loritimetop <page>` | `ttop`, `lttop`, `ltop`, `toptimes` | Get a list of players recognized by LoriTime, sorted by the most time spent online. | `loritime.top` |
| `/lta info` or `/plta info` | Backend: `lta`; proxy: `plta` | Get basic plugin info. | `loritime.admin` |
| `/lta reload` or `/plta reload` | Backend: `lta`; proxy: `plta` | Reloads the local LoriTime instance and config. | `loritime.admin` |
| `/lta update` or `/plta update` | Backend: `lta`; proxy: `plta` | Updates the plugin if an update is available. | `loritime.admin` |
| `/lta debug` or `/plta debug` | Backend: `lta`; proxy: `plta` | Enable or disable the debugger. | `loritime.admin` |
| `/lta transfer [player] server:<source> [world:<source>] to-server:<target> [to-world:<target>] [time:<range>]` or `/plta transfer ...` | Backend: `lta`; proxy: `plta` | Preview and confirm storage history transfer between server or world scopes. Omit `player` to transfer all players. | `loritime.admin` |
| `/lta confirm` or `/plta confirm` | Backend: `lta`; proxy: `plta` | Confirm the pending admin transfer action within 15 seconds. | `loritime.admin` |
| `/ltmodify set <player> <TimeString> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `ltm`, `ltmod` | Set the time to the given time string. | `loritime.admin` |
| `/ltmodify modify <player> <TimeString> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `ltm`, `ltmod` | Adds or removes the time given in the time string. | `loritime.admin` |
| `/ltmodify reset <player> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `ltm`, `ltmod` | Resets all the time stored on a player. | `loritime.admin` |
| `/ltmodify deleteUser <player> confirm` | `ltm`, `ltmod` | Deletes the user entirely from LoriTime. | `loritime.admin` |
| `/afk` | None | Set yourself AFK or not. | `loritime.afk` |

> **Note:** The debugger will be turned off automatically after the configured time. Be aware that you need to enable the debugger via the console if you use multi-setup.

> **Note:** `reload`, `debug`, `info`, and `update` are admin subcommands and operate only on the instance where they are executed. In a multi-setup, run them on each proxy/backend instance that should be affected.

> **Note:** Canonical data commands such as time lookup, top list, and modify actions are available on proxy storage owners and backend `standalone`/`master` instances. Backend `slave` instances register admin and AFK when enabled, but not modify.

> **Note:** You can customize command names and aliases in `commands.yml`. Command availability is still decided by LoriTime's runtime profile so unsupported commands are not registered on the wrong instance type.

## Admin Transfer Command

The admin transfer command rewrites stored LoriTime history from one server or world scope to another. It is intended for administrative corrections such as renamed servers, renamed worlds, or data that was tracked under the wrong scope.

<p style="color:red"><strong>WARNING: Transfer operations cannot be reverted by LoriTime.</strong> A confirmed transfer mutates stored history in the database. Create and verify a database backup before confirming any transfer. The only reliable rollback is restoring a backup.</p>

Transfer is preview-first. Running `/lta transfer ...` or `/plta transfer ...` does not mutate storage. LoriTime shows a preview with the source, target, affected sessions, affected adjustments, affected players, merge status, and a red irreversible-operation warning. To apply the preview, run `/lta confirm` or `/plta confirm` within 15 seconds. The preview includes a clickable confirm action that suggests the confirm command in chat.

### Syntax

```text
/lta transfer [player] server:<sourceServer> to-server:<targetServer> [time:<range>]
/lta transfer [player] server:<sourceServer> world:<sourceWorld> [to-server:<targetServer>] to-world:<targetWorld> [time:<range>]
/lta confirm
```

On proxy setups, use the proxy admin command name if configured:

```text
/plta transfer ...
/plta confirm
```

Short scope flags are also accepted:

```text
s:<server>
w:<world>
ts:<targetServer>
tw:<targetWorld>
t:<range>
```

### Player Selection

If `player` is provided, LoriTime resolves that player to a stored UUID first and only moves that player's matching data. Unknown players are rejected before a preview is created.

If `player` is omitted, LoriTime uses the full-scope maintenance transfer path and moves matching data for all players. All-player transfers do not support `time:<range>` in this release.

### Server Transfers

Server transfers move data from one server scope to another server scope.

```text
/lta transfer Lorias_ server:survival to-server:minigames
/lta confirm
```

This moves only `Lorias_` from `survival` to `minigames`.

```text
/lta transfer server:survival to-server:minigames
/lta confirm
```

This moves all players from `survival` to `minigames`.

For a server transfer, LoriTime:

- Recreates each source world name under the target server when needed.
- Moves matching session rows from `sourceServer/<world>` to `targetServer/<sameWorld>`.
- Moves matching server-scoped manual adjustments from the source server to the target server.
- Moves matching world-scoped manual adjustments under the source server to matching worlds under the target server.
- Leaves global manual adjustments unchanged.
- Merges into existing target server/world data when target scopes already exist.
- Removes empty source world/server rows when no references remain.

### World Transfers

World transfers move data from one world scope to another world scope.

```text
/lta transfer Lorias_ server:survival world:old_world to-world:new_world
/lta confirm
```

This moves only `Lorias_` from `survival/old_world` to `survival/new_world`.

```text
/lta transfer server:survival world:old_world to-server:minigames to-world:arena
/lta confirm
```

This moves all players from `survival/old_world` to `minigames/arena`.

For a world transfer, LoriTime:

- Creates the target world under the target server when needed.
- Moves matching session rows from the source world to the target world.
- Moves matching world-scoped manual adjustments from the source world to the target world.
- Does not move server-scoped or global manual adjustments.
- Merges into existing target world data when the target world already exists.
- Removes the empty source world row when no references remain.

### Omitting Source Server For World Transfers

For player-scoped world transfers, `server:<sourceServer>` may be omitted:

```text
/lta transfer Lorias_ world:old_world to-world:new_world
/lta confirm
```

On a proxy runtime, LoriTime uses the target player's current server when it can be resolved. On backend runtimes, LoriTime uses the local server name. If a proxy cannot resolve the player's current server, the command is rejected without mutation.

For all-player world transfers, provide `server:<sourceServer>` explicitly unless the local server name is the intended source.

### Time-Filtered Player Transfers

Player-scoped transfers can include a time range:

```text
/lta transfer Lorias_ server:survival to-server:minigames time:7d
/lta transfer Lorias_ server:survival world:old_world to-world:new_world time:3d-4w
```

`time:7d` selects rows from now back seven days. `time:3d-4w` selects rows from four weeks ago up to three days ago.

The time filter selects whole persisted rows:

- Sessions move only when both join and leave timestamps are inside the range.
- Partially overlapping sessions are not split and remain at the source.
- Matching non-global adjustments move only when their creation timestamp is inside the range.

All-player transfers reject `time:<range>` because full-scope transfer requests do not carry time-range selection.

### Active Time Counting

Transfer mutates persisted database rows. It does not pause, stop, restart, or retarget live player tracking.

Active sessions are already stored as rows while players are online. If an active session row belongs to a transferred source scope, the transfer can repoint that row to the target scope. Later normal flush or leave updates continue updating that same session row by id, so the row generally remains under the transferred target scope.

The in-memory active session context is not changed by the transfer. If the player remains physically on the old server/world, future context changes may continue to use whatever server/world the runtime reports after the transfer.

### Backup Recommendation

Before confirming a transfer:

- Stop and verify any automated database backup has completed, or take a manual backup.
- Read the preview counts and source/target labels carefully.
- Check whether `merge` is true, because target history already exists and will be combined.
- Confirm only when the preview matches the intended historical correction.

After confirmation, LoriTime has no command to undo the transfer. Restore a database backup if the result needs to be reverted.
<details>
<summary>Custom command alias</summary>

```yml
profiles:
  proxy:
    admin:
      name: 'plta'
      aliases: ['loritimeadmin', 'loritimeproxyadmin']
    modify:
      name: 'ltmodify'
      aliases: ['ltm', 'ltmod']
  backend:
    canonical:
      admin:
        name: 'lta'
        aliases: ['loritimeadmin', 'loritimea']
      modify:
        name: 'ltmodify'
        aliases: ['ltm', 'ltmod']
    slave:
      admin:
        name: 'lta'
        aliases: ['loritimeadmin', 'loritimea']
```

</details>

Existing alias customizations from `config.yml` should be moved to the matching command node in `commands.yml`. Use `profiles.proxy` for Velocity, `profiles.backend.canonical` for backend `standalone` or `master`, and `profiles.backend.slave` for backend `slave`.




## TimeString Examples
The TimeString is a special way to set, add or remove the time on the player. The exact identifiers are written in the config and can be customized for personal use. Below are a few examples of exactly how setting, modifying and subtracting times might look. 
* just any whole number, default seconds 
* multiple combinations of amount with unit 


| TimeString examples | Effect                                 |
|---------------------|----------------------------------------|
| `77`                | 77 seconds or 1 minute and 17 seconds. |
| `4h 3min`           | 4 hours and 3 minutes                  |
| `28d 1h`            | 28 days and 1 hour                     |
| `2w1d`              | 2 weeks and one day                    |
| `1h -5min`          | 1 hour minus 5 minutes or 55 minutes   |
| `-6d`               | minus 6 days (only for modify usage)   |

