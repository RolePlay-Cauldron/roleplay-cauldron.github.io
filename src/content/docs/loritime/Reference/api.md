---
title: 'API'
description: 'Use the LoriTime public API from another plugin.'
---

## API

The LoriTime API lets other plugins read stored player online time, resolve known player identities, and write audited manual time adjustments.

## Compatibility

| Platform | LoriTime version | Supported |
|----------|------------------|-----------|
| Paper    | 2.3.0 - current  | Yes         |
| Folia    | 2.3.0 - current  | Yes         |
| Velocity | 2.3.0 - current  | Yes         |

## Dependency Setup

LoriTime releases are published to **GitHub Packages** as Maven artifacts. A mirror hosted by a maintainer is available as an alternative. Artifacts are available starting with the first release after 2.3.0; older releases are not available as Maven dependencies.

### Option 1: GitHub Packages

:::caution[Authentication required]
GitHub **always** requires authentication to resolve artifacts from GitHub Packages, even for public repositories. This is a limitation of GitHub, not of LoriTime.
:::

1. Create a personal access token (classic) at [github.com/settings/tokens](https://github.com/settings/tokens). Only the `read:packages` scope is required.
2. Add the credentials to your Maven `~/.m2/settings.xml`:

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <servers>
    <server>
      <id>github</id>
      <username>YOUR_GH_USERNAME</username>
      <password>YOUR_GITHUB_TOKEN</password>
    </server>
  </servers>
</settings>
```

3. Add the repository to your plugin's `pom.xml`. The `id` must match the server `id` from your `settings.xml`:

```xml
<repositories>
  <repository>
    <id>github</id>
    <name>GitHub Packages</name>
    <url>https://maven.pkg.github.com/RolePlay-Cauldron/LoriTime</url>
  </repository>
</repositories>
```

### Option 2: Mirror Repository

Add the mirror to your plugin's `pom.xml`. No authentication is required.

```xml
<repositories>
  <repository>
    <id>mvn.velyn.me-github</id>
    <url>https://mvn.velyn.me/github</url>
  </repository>
</repositories>
```

:::caution[Mirror is not guaranteed]
This mirror is hosted by one of the maintainers and is not guaranteed. It may change or go offline without notice. Prefer GitHub Packages whenever possible, especially for reliable builds in CI/CD environments.
:::

### Add the Dependencies

Only add the modules you need. `common` contains the platform-independent API, including `LoriTimeAPI` and `LoriTimeService`. `loritimepaper` and `loritimevelocity` contain the platform-specific plugin classes and events.

Replace the version with the [release](https://github.com/RolePlay-Cauldron/LoriTime/releases) you build against.

```xml
<dependencies>
  <dependency>
    <groupId>com.jannik_kuehn</groupId>
    <artifactId>common</artifactId>
    <version>LORITIME_VERSION</version>
    <scope>provided</scope>
  </dependency>
  <!-- Optional: platform-specific classes and events -->
  <dependency>
    <groupId>com.jannik_kuehn</groupId>
    <artifactId>loritimepaper</artifactId>
    <version>LORITIME_VERSION</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
```

Use `loritimevelocity` instead of `loritimepaper` for Velocity plugins.

LoriTime is a standalone plugin. Use the `provided` scope and do **not** shade it into your plugin. Declare LoriTime as a plugin dependency instead, so the server loads it before your plugin.

### Declare the Plugin Dependency

#### Paper / Folia

The Paper plugin is named `LoriTimePaper`.

`paper-plugin.yml`:

```yml
dependencies:
  server:
    LoriTimePaper:
      load: BEFORE
      required: true
      join-classpath: true
```

Legacy `plugin.yml`:

```yml
depend: [ LoriTimePaper ]
```

Set `required: false` or use `softdepend` instead of `depend` if your plugin can run without LoriTime.

#### Velocity

The Velocity plugin id is `loritimevelocity`.

`velocity-plugin.json`:

```json
"dependencies": [
  {
    "id": "loritimevelocity",
    "optional": false
  }
]
```

`@Plugin` annotation:

```java
@Plugin(id = "myplugin", dependencies = {@Dependency(id = "loritimevelocity")})
```

## Recommended Facade

Use `LoriTimeAPI.service()` for new integrations. It returns an `Optional<LoriTimeService>` because LoriTime may not be installed or initialized yet. `LoriTimeService` is the stable interface; do not depend on LoriTime's internal service implementation classes.

```java
import com.jannik_kuehn.common.api.LoriTimeAPI;
import com.jannik_kuehn.common.api.LoriTimeService;

public final class LoriTimeHook {

    private LoriTimeService loriTime;

    public void enable() {
        LoriTimeAPI.service().ifPresent(service -> this.loriTime = service);
    }
}
```

If LoriTime is a hard dependency and your plugin enables after LoriTime, the optional should normally be present during your enable phase.

## Reading Player Data

## Public Player Model

`LoriTimePlayer` is the stable public player identity contract. It exposes only the player's UUID and latest known name. Time operations always use the UUID as the exact player identity; the name is display or audit metadata.

Use `LoriTimePlayerRef` when your plugin needs to keep or create a player reference:

```java
LoriTimePlayer player = new LoriTimePlayerRef(uniqueId, playerName);
```

LoriTime internals may use richer sender objects for permissions, messages, console state, or online state. Those sender details are not part of the public `LoriTimePlayer` contract.

### Resolve UUID by Name

```java
loriTime.findUuid("Lorias_").thenAccept(optionalUniqueId -> {
    optionalUniqueId.ifPresent(uniqueId -> {
        // Use the UUID in your plugin.
    });
});
```

### Resolve Latest Name by UUID

```java
loriTime.findName(uniqueId).thenAccept(optionalName -> {
    optionalName.ifPresent(name -> {
        // Use the latest known name in your plugin.
    });
});
```

### Read Online Time

```java
loriTime.getOnlineTime(uniqueId).thenAccept(optionalOnlineTime -> {
    optionalOnlineTime.ifPresent(duration -> {
        long seconds = duration.toSeconds();
    });
});
```

If you already have a `LoriTimePlayer`, use the player overload:

```java
loriTime.getOnlineTime(player).thenAccept(optionalOnlineTime -> {
    optionalOnlineTime.ifPresent(duration -> {
        // Use the player's time.
    });
});
```

An empty result means LoriTime does not currently have stored data for that player.

### Read Scoped Online Time

Use `TimeScope` to query global, server, or world totals:

```java
import com.jannik_kuehn.common.api.storage.TimeScope;

loriTime.getOnlineTime(uniqueId, TimeScope.server("survival")).thenAccept(optionalOnlineTime -> {
    optionalOnlineTime.ifPresent(duration -> {
        long seconds = duration.toSeconds();
    });
});

loriTime.getOnlineTime(uniqueId, TimeScope.world("survival", "world"));
```

### Read Time In A Range

Use `TimeRange` to query a bounded inclusive-start/exclusive-end history window. Ranged totals clip session rows to the requested window and include manual adjustments whose audit timestamp is inside the range.

```java
import com.jannik_kuehn.common.api.storage.TimeRange;
import com.jannik_kuehn.common.api.storage.TimeScope;

TimeRange lastSevenDays = TimeRange.between(
        Instant.now().minus(Duration.ofDays(7)),
        Instant.now()
);

loriTime.getOnlineTime(uniqueId, TimeScope.server("survival"), lastSevenDays)
        .thenAccept(optionalOnlineTime -> {
            optionalOnlineTime.ifPresent(duration -> {
                long seconds = duration.toSeconds();
            });
        });
```

The ranged overload is part of the LoriTime 2 API surface.

## Writing Manual Adjustments

Use signed durations. Positive values add time, negative values remove time. Durations must be precise to whole seconds.

### System/API Adjustment

```java
loriTime.addTime(uniqueId, Duration.ofMinutes(10)).thenRun(() -> {
    // The write was attempted successfully.
});
loriTime.addTime(uniqueId, Duration.ofMinutes(-5));
```

The same operation can target a public player reference:

```java
loriTime.addTime(player, Duration.ofMinutes(10));
```

These adjustments are stored with LoriTime's stable API actor name.

To write a scoped adjustment, pass a `TimeScope`:

```java
loriTime.addTime(uniqueId, Duration.ofMinutes(10), TimeScope.server("survival"));
loriTime.addTime(uniqueId, Duration.ofMinutes(-5), TimeScope.world("survival", "world"));
```

### Actor-Aware Adjustment

```java
loriTime.addTime(
        uniqueId,
        Duration.ofMinutes(10),
        actorUniqueId,
        actorName
).thenRun(() -> {
    // The actor-aware write completed.
});
```

Or pass public player identities for both target and actor:

```java
loriTime.addTime(
        targetPlayer,
        Duration.ofMinutes(10),
        actorPlayer
);
```

Actor-aware adjustments preserve the actor UUID and actor name in LoriTime's adjustment history.

Actor-aware adjustments can also be scoped:

```java
loriTime.addTime(uniqueId, Duration.ofMinutes(10), actorUniqueId, actorName, TimeScope.server("survival"));
```

## Formatting Durations

`formatDuration(Duration)` formats a duration the same way LoriTime does in its own messages and placeholders, using the configured language units. The duration must be precise to whole seconds.

```java
String text = loriTime.formatDuration(duration); // e.g. "1 h 2 min"
```

Available since LoriTime 2.3.0.

## Events

LoriTime publishes events through the native event system of the platform. There is no separate LoriTime event bus: use a normal Bukkit listener on Paper and Folia, or an `@Subscribe` method on Velocity.

| Event | Fired when |
|-------|------------|
| `LoriTimeSessionStartEvent` | LoriTime starts tracking a player session |
| `LoriTimeSessionEndEvent` | LoriTime stops tracking a player session |
| `LoriTimeAfkStateChangeEvent` | A player becomes AFK or resumes |
| `LoriTimeTimeAdjustedEvent` | A manual, API or AFK time adjustment is stored |
| `LoriTimeTrackingTagChangeEvent` | The tracking tags of a player change |

Paper events live in `com.jannik_kuehn.loritimepaper.event`, Velocity events in `com.jannik_kuehn.loritimevelocity.event`.

```java
@EventHandler
public void onTimeAdjusted(LoriTimeTimeAdjustedEvent event) {
    getLogger().info(event.getPlayerId() + " was adjusted by " + event.getAmount());
}
```

```java
@Subscribe
public void onSessionStart(LoriTimeSessionStartEvent event) {
    logger.info(event.playerId() + " is now tracked on " + event.server());
}
```

Things to keep in mind:

- Events are fired on standalone installations and on masters. Slave servers do not fire them.
- Paper events are asynchronous when LoriTime fires them off the main thread. Do not assume the main thread in your handler.
- Moving between servers or worlds inside one session does not fire session events.

Available since LoriTime 2.3.0.

## Tracking Tags

Tracking tags let you attribute a player's online time to your own dimension, for example one roleplay character per player. A tag is a namespaced key with a value. Time can then be queried per tag.

```java
loriTime.setTrackingTag(uniqueId, "myplugin:character", "Aria");
loriTime.clearTrackingTag(uniqueId, "myplugin:character");
```

```java
loriTime.getOnlineTime(uniqueId, TimeScope.GLOBAL, "myplugin:character", "Aria")
        .thenAccept(optionalTime -> optionalTime.ifPresent(duration -> {
            // Time the player spent with this tag value.
        }));

// With a time range:
loriTime.getOnlineTime(uniqueId, TimeScope.GLOBAL, lastSevenDays, "myplugin:character", "Aria");
```

### Rules

- Keys must be namespaced and lower case, such as `myplugin:character`, with at most 100 characters. Use your own plugin name as the namespace. Values must not be blank and have at most 191 characters.
- The player must be online. Tags are not kept after the player leaves, so set them again after every join.
- A player can carry several tags. Different plugins with different keys do not affect each other.
- Setting a key that already exists replaces the value. LoriTime does not track which plugin owns a key, so any plugin could overwrite another plugin's key.
- Setting a tag to the value it already has, or clearing a tag that is not set, does nothing.

### How time is attributed

A tag change closes the current session segment and starts a new one that carries the new tags. Time is attributed from the moment of the change on, never backwards.

- Only segments that carry the requested key and value count for a tagged query.
- AFK time stays excluded, exactly as for untagged queries.
- Manual adjustments are not part of tagged time, because they do not belong to a segment.
- Total playtime and statistics are not affected. LoriTime treats the split like a world switch, so `/ltstats` still counts one session.
- Tags stay on the player through an AFK pause and are applied again when the player resumes.

Every tag change stores one additional history row. Tags are meant for infrequent switches such as a character or role change. Do not change tags every few seconds.

### Tag change event

`LoriTimeTrackingTagChangeEvent` is fired whenever the tags of a player change. It carries the previous and the new tag set (`getPreviousTags()` and `getTags()` on Paper, `previousTags()` and `tags()` on Velocity).

### Slave servers

On a slave server, `setTrackingTag` and `clearTrackingTag` work for players that are online there and are forwarded to the master. Tagged time queries need the master and fail with a `LoriTimeApiException` on a slave. If the master runs an older LoriTime version, it ignores the tag message, so the tag is never applied there.

Available since LoriTime 2.3.0.

## Errors

Facade methods validate null inputs and unsupported duration values before scheduling storage work. Storage failures complete the returned future exceptionally with `LoriTimeApiException`, so integrations do not need to handle raw storage or SQL exceptions from the public facade.

```java
loriTime.addTime(uniqueId, Duration.ofSeconds(30)).exceptionally(ex -> {
    Throwable cause = ex.getCause();
    if (cause instanceof LoriTimeApiException apiException) {
        getLogger().warning("Could not update LoriTime: " + apiException.getMessage());
    }
    return null;
});
```

## Threading and Storage Modes

The facade returns `CompletableFuture` values. LoriTime schedules the blocking storage work asynchronously, and future continuations run in that asynchronous completion context unless you reschedule them. If your continuation touches Paper, Folia, Velocity or other platform-thread-bound APIs, reschedule that work through your platform scheduler first.

### Slave Servers

A slave server has no canonical storage, so only a small part of the API is available there. Use `isFullAccess()` to find out which situation applies:

```java
if (!loriTime.isFullAccess()) {
    // Slave server: only getOnlineTime(uniqueId) for online players and tracking tags are supported.
}
```

- `getOnlineTime(uniqueId)` for a player that is online on the slave is answered from the slave read cache.
- `setTrackingTag` and `clearTrackingTag` are forwarded to the master for players that are online on the slave.
- Every other call (scoped or ranged queries, offline players, identity lookups, writes) completes exceptionally with a `LoriTimeApiException` instead of staying pending.

Futures always complete. Unexpected runtime failures are reported as a `LoriTimeApiException` as well.

## API Surface

`LoriTimeAPI.service()`, the `LoriTimeService` interface, `LoriTimePlayer`, and immutable public player references are the stable public integration surface for normal third-party plugins.

New methods on `LoriTimeService` are added as `default` methods or new overloads, so an integration compiled against an earlier minor release keeps working. The platform events listed above are part of the public surface as well.

Internal classes such as `LoriTimePlugin`, platform adapters, scheduler adapters, storage lifecycle managers, storage contracts, accumulators, configuration, localization, and updater state are not part of the public integration API unless a future change introduces a dedicated advanced extension API.

