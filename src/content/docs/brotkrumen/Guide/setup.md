---
title: Setup
description: How to install and configure Brotkrumen on your server
---

This guide walks you through installing **Brotkrumen** on your server.

## Requirements

Before installing Brotkrumen, make sure your server setup is supported.

- Paper 1.21 or newer
- Java 21
- The correct `.jar` file for your server type from the <a href="https://github.com/RolePlay-Cauldron/Brotkrumen/releases/latest" target="_blank">latest release</a>.

## 1. Install the jar file

Place the Brotkrumen `.jar` file into your server's plugin directory.

For example:

```txt
plugins/Brotkrumen.jar
```

## 2. Start and stop the server

Start your server once.

Brotkrumen will automatically generate the default configuration, localization files, storage files, and visual presets.

After the files have been created, stop the server again.

## 3. Configure Brotkrumen

Edit the generated configuration files if needed.

Most setups should work with the default SQLite storage and `ember` visual preset. You can change storage, localization, visualizer, resolve, and editor settings later in `config.yml`.

## 4. Start your server again

Start your server again.

Brotkrumen should now load normally and is ready to use.

## 5. Create your first graph

Brotkrumen needs graph data before it can resolve paths. Start by creating a graph in-game:

```txt
/bkeditor create spawn
/bkeditor place
/bkeditor finish
```

Use `/bkeditor` for graph editing and `/bk resolve` for guided player navigation.
