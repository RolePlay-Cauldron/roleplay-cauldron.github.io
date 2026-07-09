---
title: 'Backup'
description: 'Configure automatic config and language file backups.'
---

## Configuration
* Set `backup.enabled` to `true`
* Set `backup.maxBackups` to limit the amount of backups. Set to 0 to disable the backup limit and keep all backups.

> **Warning:**If you disable the maximum amount of backups, the plugin will create a new backup every time the server starts. This can lead to a lot of backups and can fill up your storage space.

Sadly the whole styling of the config and language file will be lost after the first automated config update.
This is a compromise to have an automated file update system. 


If you want to keep the style of the config file, you have to regenerate the config and language file each time you update the plugin.

## Before Storage Transfer

The automatic backup system covers config and language files. It is not a database backup.

Before running `/lta storage transfer <target>` and `/lta confirm`, create a database backup yourself:

- For SQLite, copy `plugins/LoriTime/loritime.db` while the server is stopped or after confirming no writes are active.
- For MySQL or MariaDB, create a dump or provider-level backup of the configured LoriTime database.
- Keep the source backup until the target storage has been checked in game.

The target storage for storage transfer must be empty. If a transfer fails after partial target writes, use a fresh empty target or restore the target backup before retrying.

## The config part
<details>
<summary>Backup-Config (config.yml)</summary>

```yml
###########
# Backups #
###########
backup:

  # If true, the plugin will create backups every time the config or language files got an update.
  enabled: true

  # The maximum number of backups that will be stored.
  # If the number of backups exceeds this value, the oldest backup will be deleted.
  # Set this to 0 to disable the deletion of old backups.
  maxBackups: 5
```

</details>

