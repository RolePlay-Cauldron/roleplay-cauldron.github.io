---
title: 'Commands'
description: 'Commands, permissions, aliases, and time string examples.'
---

LoriTime commands are grouped by command family below. Command names and aliases can be customized in `commands.yml`; availability is still decided by LoriTime's runtime profile.

> **Runtime note:** Canonical data commands such as time lookup, top list, and modify actions are available on proxy storage owners and backend `standalone`/`master` instances. Backend `slave` instances register local admin commands and AFK when enabled, but not canonical data mutation commands.

## `/loritime` Time Lookup

Aliases: `lt`, `lorit`, `ltime`

| Command | Description | Permission |
|---------|-------------|------------|
| `/loritime` | View your global online time. | `loritime.see` |
| `/loritime <player>` | View another player's global online time. | `loritime.see.other` |
| `/loritime [server:<server> \| s:<server>] [<player>]` | View online time for one server. | `loritime.see.server` / `loritime.see.server.other` |
| `/loritime [world:<world> \| w:<world>] [server:<server> \| s:<server>] [<player>]` | View online time for one world. Without a server flag, LoriTime uses the current backend on a proxy or the configured local server name on standalone backends. | `loritime.see.world` / `loritime.see.world.other` |
| `/loritime [<player>] [time:<range> \| t:<range>] [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | View online time inside a history window. | Selected lookup permission plus `loritime.see.timerange` / `loritime.see.timerange.other` |

Examples:

```text
/lt
/lt Lorias_
/lt server:survival Lorias_
/lt world:spawn server:lobby
/lt Lorias_ server:survival time:7d
/lt Lorias_ world:spawn server:lobby time:3d-4w
```

`time:7d` queries from now back seven days. `time:3d-4w` queries from four weeks ago up to three days ago.

## `/loritimetop` Top List

Aliases: `ttop`, `lttop`, `ltop`, `toptimes`

| Command | Description | Permission |
|---------|-------------|------------|
| `/loritimetop <page>` | List players recognized by LoriTime, sorted by the most online time. | `loritime.top` |

## `/lta` Admin Commands

Backend command: `/lta`  
Proxy command: `/plta`

| Command | Description | Permission |
|---------|-------------|------------|
| `/lta info` | Show plugin and server version information for the current instance. | `loritime.admin` |
| `/lta reload` | Reload the current LoriTime instance and config. | `loritime.admin` |
| `/lta update` | Run the configured update flow when an update is available. | `loritime.admin` |
| `/lta debug` | Enable or disable debug logging for the current instance. | `loritime.admin` |
| `/lta storage transfer <target>` | Preview and confirm copying all LoriTime data to another storage type. | `loritime.admin` |
| `/lta transfer ...` | Preview and confirm moving stored history between server/world scopes. | `loritime.admin` |
| `/lta deleteHistory ...` | Preview and confirm deleting stored history for one server/world scope. | `loritime.admin` |
| `/lta confirm` | Confirm the pending admin maintenance action within 15 seconds. | `loritime.admin` |

`reload`, `debug`, `info`, and `update` operate only on the instance where they are executed. In a multi-setup, run them on each proxy/backend instance that should be affected.

### Admin Storage Transfer

Storage transfer copies all LoriTime data from the active storage type to another supported storage type.

```text
/lta storage transfer sqlite
/lta storage transfer mysql
/lta storage transfer mariadb
/lta confirm
```

The command is preview-first. The preview validates the source, validates the target connection, creates or updates target tables when needed, verifies the target is empty, and reports affected sessions, adjustments, and players. LoriTime copies data only after `/lta confirm`.

The target must be empty. Fresh schema-created default/global reference rows are allowed, but existing player, session, adjustment, or custom scope data blocks the transfer. Storage transfer does not merge databases.

Supported direct paths:

- `sqlite` to `mysql`
- `sqlite` to `mariadb`
- `mysql` to `sqlite`
- `mariadb` to `sqlite`

Direct `mysql` to `mariadb` and `mariadb` to `mysql` transfers are not supported because LoriTime has only one SQL connection configuration. Use SQLite as the bridge:

```text
# Old SQL storage is active
/lta storage transfer sqlite
/lta confirm

# Stop the server, update storageMethod and SQL connection settings, then start again

# SQLite storage is active and the configured SQL target is empty
/lta storage transfer mysql
/lta confirm
```

Use `mariadb` in the last command when the new SQL target is MariaDB.

Before confirming:

- Make a verified backup of the source database.
- Run the command during maintenance or low activity.
- Check that the target storage is fresh and empty.
- Check the preview counts.
- Wait for the final success or failure message.

LoriTime flushes active online time before preview and before confirmation. If the source data or target data changes after preview, `/lta confirm` can fail and the preview must be run again.

:::danger[Warning]
For safety reasons make sure you've created a backup before running this command!

:::

### Admin Transfer

Transfer rewrites stored LoriTime history from one server or world scope to another. It is intended for administrative corrections such as renamed servers, renamed worlds, or data tracked under the wrong scope.

```text
/lta transfer [player] server:<sourceServer> to-server:<targetServer> [time:<range>]
/lta transfer [player] server:<sourceServer> world:<sourceWorld> [to-server:<targetServer>] to-world:<targetWorld> [time:<range>]
/lta confirm
```

Short flags are accepted:

```text
s:<server>
w:<world>
ts:<targetServer>
tw:<targetWorld>
t:<range>
```

If `player` is provided, LoriTime resolves that player to a stored UUID first and only moves that player's matching data. Unknown players are rejected before preview. If `player` is omitted, LoriTime moves matching data for all players. All-player transfers do not support `time:<range>`.

Server transfers move sessions under the source server, server-scoped adjustments, and world-scoped adjustments under the source server. World transfers move sessions and world-scoped adjustments for the exact world. Global adjustments are not transferred.

Player-scoped transfers can include a time range. Sessions move only when both join and leave timestamps are inside the range. Partially overlapping sessions are not split. Matching non-global adjustments move only when their creation timestamp is inside the range.

### Admin DeleteHistory

`deleteHistory` removes persisted scoped time history. It does not delete player identities and it does not remove global manual adjustments.

```text
/lta deleteHistory [player] server:<sourceServer> [time:<range>]
/lta deleteHistory [player] server:<sourceServer> world:<sourceWorld> [time:<range>]
/lta confirm
```

Short flags are accepted:

```text
s:<server>
w:<world>
t:<range>
```

If `player` is provided, LoriTime resolves that player first and deletes only that player's matching history. If `player` is omitted, LoriTime deletes matching history for all players.

Server history deletion removes:

- Sessions in all worlds under the server.
- Server-scoped adjustments for the server.
- World-scoped adjustments under the server.
- Empty unreferenced server/world rows after the delete.

World history deletion removes:

- Sessions in the exact server/world.
- World-scoped adjustments in the exact server/world.
- Empty unreferenced world rows after the delete.

World deletion does not remove server-scoped adjustments. Scoped history deletion never removes global adjustments or player identities.

`time:<range>` can be used for all-player and player-specific deletes. Sessions are deleted only when both join and leave timestamps are inside the range. Partially overlapping sessions remain unchanged. Matching non-global adjustments are deleted only when their creation timestamp is inside the range.

### Preview And Confirmation

Transfer and deleteHistory are preview-first. Running the preview command does not mutate storage. LoriTime shows the selected player/all-player target, source or target scope, optional time range, affected sessions, affected adjustments, affected players, and a warning.

It is recommended to perform these actions only on an empty server, since any change to memory (such as joining a game, switching worlds, or leaving) will cause an inconsistency between the preview version and the current database state. This will cause the confirmation to be canceled and not executed. 
:::danger[Warning]
LoriTime cannot revert Confirmed maintenance operations.

A confirmed transfer rewrites stored history, and a confirmed deleteHistory removes stored history. It's recommendet to create a database backup before running `/lta confirm` or `/plta confirm`.</p>

:::

The preview includes a clickable confirm action that suggests `/lta confirm`. The confirmation expires after 15 seconds.

Before confirming:

- Verify the source/target labels and affected counts.
- Check whether the operation applies to one player or all players.
- Check the time range if one was supplied.
- Confirm only when a verified database backup exists.

## `/ltmodify` Player Time Mutation

Aliases: `ltm`, `ltmod`

| Command | Description | Permission |
|---------|-------------|------------|
| `/ltmodify set <player> <TimeString> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | Set a player's global, server, or world time to the given value. | `loritime.admin` |
| `/ltmodify modify <player> <TimeString> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | Add or remove time from a player's global, server, or world total. | `loritime.admin` |
| `/ltmodify reset <player> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | Reset a player's global, server, or world time to zero. | `loritime.admin` |
| `/ltmodify deleteUser <player> confirm` | Delete the user identity and all of that user's LoriTime data. | `loritime.admin` |

`deleteUser` is different from `/lta deleteHistory`: `deleteUser` removes the player identity entirely, while `deleteHistory` removes scoped history rows and preserves identities.

## `/afk`

| Command | Description | Permission |
|---------|-------------|------------|
| `/afk` | Toggle your AFK state. | `loritime.afk` |

## Custom Command Aliases

Customize command names and aliases in `commands.yml`:

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

Existing alias customizations from `config.yml` should be moved to the matching command node in `commands.yml`. Use `profiles.proxy` for Velocity, `profiles.backend.canonical` for backend `standalone` or `master`, and `profiles.backend.slave` for backend `slave`.

## TimeString Examples

The TimeString format is used by `/ltmodify` and configuration values such as AFK timing. Unit identifiers are configurable.

| TimeString examples | Effect |
|---------------------|--------|
| `77` | 77 seconds, or 1 minute and 17 seconds. |
| `4h 3min` | 4 hours and 3 minutes. |
| `28d 1h` | 28 days and 1 hour. |
| `2w1d` | 2 weeks and one day. |
| `1h -5min` | 1 hour minus 5 minutes, or 55 minutes. |
| `-6d` | Minus 6 days, only for modify usage. |
