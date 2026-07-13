---
title: 'Statistics'
description: 'Network statistics views, filters, permissions, and configuration for the ltstats command.'
---

`/ltstats` provides bounded statistics from LoriTime's persisted session and AFK history. It is available on proxy storage owners and backend `standalone` or `master` instances. Backend `slave` instances do not register the command.

The command requires the `loritime.stats` permission. Its default aliases are `/stats` and `/loritimestats`; the name and aliases can be customized in `commands.yml`.

## Usage

Run `/ltstats` without a view to show the network overview:

```text
/ltstats
/ltstats time:7d
/ltstats calendar:today
/ltstats calendar:2d-3d
/ltstats server:survival
/ltstats sessions world:spawn server:lobby calendar:2w-3w
```

The full syntax is:

```text
/ltstats [users|sessions|usage|top|afk|retention] [time:<range>|calendar:<period>] [server:<server>] [world:<world>]
```

The first argument selects a focused view. Filters can follow in any order.

| View | Information |
|------|-------------|
| Overview | Unique and new users, sessions, playtime, session duration, bounces, peak concurrency, and AFK activity. |
| `users` | Unique users, new users, and matured seven-day retention. |
| `sessions` | Session count, median and longest session, sessions per user, bounces, and peak concurrency. |
| `usage` | Up to ten server scopes ranked by playtime, with duration and percentage share. |
| `top` | Up to ten players ranked by playtime in the selected range and scope. |
| `afk` | Players with AFK activity, AFK periods, total AFK duration, and AFK kicks. |
| `retention` | New users and matured seven-day retention. |

Examples:

```text
/ltstats users time:30d
/ltstats sessions server:survival time:7d
/ltstats usage time:14d
/ltstats top world:spawn server:lobby calendar:today
/ltstats afk time:7d
/ltstats retention calendar:2mo-4mo
```

## Filters And Scope

`time:<range>` uses LoriTime's [TimeString and range syntax](../guide/commands.md#timestring-examples). A single duration such as `time:7d` covers the previous seven days. A bounded expression such as `time:3d-4w` selects the period from four weeks ago through three days ago.

`calendar:<period>` uses local calendar boundaries instead of fixed elapsed durations. It cannot be combined
with `time:`.

| Calendar form | Selected range |
|---------------|----------------|
| `calendar:today` or `calendar:1d` | Local midnight today through the request time. |
| `calendar:this-week` or `calendar:1w` | Monday 00:00 of the current ISO week through the request time. |
| `calendar:this-month` or `calendar:1mo` | First day of the current month at 00:00 through the request time. |
| `calendar:Nd` | Current partial day plus the preceding `N - 1` complete days. |
| `calendar:Nw` | Current partial ISO week plus the preceding `N - 1` complete weeks. |
| `calendar:Nmo` | Current partial month plus the preceding `N - 1` complete months. |
| `calendar:Aunit-Bunit` | Complete ordinal units `A` through `B`; both endpoints use `d`, `w`, or `mo`, and `A <= B`. |

Ordinal `1` is the current unit, `2` the previous unit, and `3` the unit before that. Therefore,
`calendar:2d-3d` selects yesterday and the day before, from two local midnights ago through today's local
midnight. `calendar:2w-3w` selects the previous two complete ISO weeks, and `calendar:2mo-3mo` selects the
previous two complete months. A slice containing ordinal `1` ends at the request time because the current unit
is still in progress. Mixed units such as `calendar:2d-3w`, reversed ranges such as `calendar:3d-2d`, zero,
negative, and malformed values are rejected.

### Calendar Timezone And International Behavior

Calendar boundaries use `stats.calendar-time-zone`. The default value, `system`, means the JVM/operating-system
timezone of the runtime that owns canonical statistics storage:

- On a standalone Paper/Folia server, this is that server process.
- In a backend `master` setup, this is the master backend process.
- In a proxy-owned network, this is the proxy process. Individual backend timezones do not change the range.

For predictable production behavior, especially when nodes run in different countries or containers default to
UTC, configure an explicit IANA timezone. Examples include `Europe/Berlin`, `America/New_York`, `Asia/Tokyo`, and
`UTC`. IANA identifiers carry the region's current and historical offset and daylight-saving rules. Short
abbreviations such as `CET`, `EST`, or `PST` can be ambiguous or behave as fixed offsets and are therefore not
recommended.

Calendar dates use the ISO/Gregorian calendar, and weeks always begin Monday according to ISO week boundaries;
the host operating system's locale does not change the week start. Day, week, and month boundaries are converted
to absolute instants before querying storage. Session timestamps remain instants/epoch milliseconds, so changing
the configured timezone does not rewrite or reinterpret stored history—it only changes the boundaries of future
calendar queries.

Daylight-saving transitions are handled by the configured IANA zone. A local day can therefore span 23 or 25
elapsed hours, while a zone without daylight saving such as `Asia/Tokyo` normally has 24-hour calendar days.
At one absolute instant, `calendar:today` may select different dates in Berlin, New York, and Tokyo because each
zone has its own local midnight. Reloading LoriTime applies a changed timezone to subsequent requests.

If a non-blank timezone identifier is invalid, LoriTime logs a warning and falls back to the canonical storage
owner's system timezone. Use an explicit region or `UTC` on every canonical owner to avoid host-dependent results
when moving the plugin between machines.

`server:<server>` limits statistics to one server. `world:<world>` limits them to one world; when no server is supplied, LoriTime uses `server.name` as the server context. Supplying both filters selects an exact server/world scope.

Statistics never accept a player-name filter. Use the `top` view for ranked player playtime or `/loritime <player>` for an individual lookup.

## Configuration

The command uses three settings from `config.yml`:

```yml
stats:
  # Range used when neither time:<range> nor calendar:<period> is supplied.
  default-range: 'calendar:today'

  # A completed network session shorter than this counts as a bounce.
  bounce-threshold: '3m'

  # Local timezone for calendar boundaries; use system or an IANA zone id.
  calendar-time-zone: 'system'
```

`stats.default-range` accepts a calendar selector such as `calendar:today` or a rolling selector such as
`time:1d`; legacy bare durations remain accepted. `stats.bounce-threshold` must be a positive TimeString.
An invalid non-blank calendar timezone logs a warning and falls back to the system timezone. Configuration reloads
apply to subsequent statistics requests.

Command aliases are configured separately for the proxy and canonical backend profiles:

```yml
profiles:
  proxy:
    stats:
      name: 'ltstats'
      aliases: ['stats', 'loritimestats']
  backend:
    canonical:
      stats:
        name: 'ltstats'
        aliases: ['stats', 'loritimestats']
```

## Metric Notes

- A session is reconstructed from persisted activity and can span adjacent world or backend-server segments.
- Active sessions are checkpointed at one request instant. They contribute to users, playtime, usage, top-player,
  concurrency, and eligible session-duration metrics through that instant.
- A bounce is a completed logical session shorter than `stats.bounce-threshold`.
- Active sessions never count as bounces. Sessions that began before the selected range contribute clipped time and
  concurrency but do not count as sessions started inside the range.
- Peak concurrency is the highest number of overlapping logical sessions inside the selected range and scope.
- New users are players whose first recorded activity falls inside the selected range.
- Seven-day retention considers only new-user cohorts old enough to have completed the seven-day observation window.
- AFK metrics use persisted AFK periods. Stale periods recovered after an unclean shutdown are closed with the `SHUTDOWN` reason.

Statistics require a storage implementation that exposes statistics history. If the active storage cannot provide it, LoriTime reports that statistics are unsupported.
