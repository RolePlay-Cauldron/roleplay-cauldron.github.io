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
| `/ltmodify set <player> <TimeString> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `ltm`, `ltmod` | Set the time to the given time string. | `loritime.admin` |
| `/ltmodify modify <player> <TimeString> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `ltm`, `ltmod` | Adds or removes the time given in the time string. | `loritime.admin` |
| `/ltmodify reset <player> [server:<server> \| s:<server>] [world:<world> \| w:<world>]` | `ltm`, `ltmod` | Resets all the time stored on a player. | `loritime.admin` |
| `/ltmodify deleteUser <player> confirm` | `ltm`, `ltmod` | Deletes the user entirely from LoriTime. | `loritime.admin` |
| `/afk` | None | Set yourself AFK or not. | `loritime.afk` |

> **Note:** The debugger will be turned off automatically after the configured time. Be aware that you need to enable the debugger via the console if you use multi-setup.

> **Note:** `reload`, `debug`, `info`, and `update` are admin subcommands and operate only on the instance where they are executed. In a multi-setup, run them on each proxy/backend instance that should be affected.

> **Note:** Canonical data commands such as time lookup, top list, and modify actions are available on proxy storage owners and backend `standalone`/`master` instances. Backend `slave` instances register admin and AFK when enabled, but not modify.

> **Note:** You can customize command names and aliases in `commands.yml`. Command availability is still decided by LoriTime's runtime profile so unsupported commands are not registered on the wrong instance type.
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

