---
title: Localization
description: Configure and customize Brotkrumen language files
---

Brotkrumen loads localization files from the plugin data folder at `language/<locale>.yml`.

The default language is controlled by `localization.defaultLocale` in `config.yml`:

```yml
################
# Localization #
################

localization:

  # Default locale used for player and console feedback.
  # Format: language tag identifier (examples: en-us, de-de)
  # Custom theme variants are supported and resolved as plain tags.
  defaultLocale: 'en-US'
```

Bundled languages are created from Brotkrumen resources when needed.

Custom languages are not copied from the jar automatically. To add a custom language, create the file yourself in the plugin data `language/` folder and set `localization.defaultLocale` to the file name without `.yml`.

For example:

```txt
plugins/Brotkrumen/language/en-US.yml
plugins/Brotkrumen/language/de-DE.yml
plugins/Brotkrumen/language/custom-theme.yml
```

A language file looks similar to this:

```yml
# Brotkrumen Language File
prefix: "<#64748B>[<gradient:#38BDF8:#6366F1>Brotkrumen</gradient><#64748B>] <#CBD5E1>"

messages:
  commands:
    common:
      playerOnlyEditor: "<#F43F5E>Only players can use the graph editor."

    bk:
      version:
        title: "<#22C55E>Brotkrumen <#38BDF8><version></#38BDF8>"
        hover:
          copyDiagnostics: "<#CBD5E1>Click to copy Brotkrumen diagnostics."
        line:
          server: "<#CBD5E1>Server: <#38BDF8><server></#38BDF8>"
          hooks: "<#CBD5E1>Hooks: <#38BDF8><hooks></#38BDF8>"

#################
# DO NOT TOUCH! #
#################
schema_version: 1
locale: "en-US"
```

:::danger[Do not edit schema metadata]
Do not change `schema_version` or `locale` inside the language file unless you know exactly what you are doing.

These values are used by Brotkrumen to identify and load the language file correctly. Changing them may cause the localization file to stop working.
:::

## Formatting

Messages use MiniMessage formatting.

You may change colors, gradients, and message text, but you should not translate or modify technical parts of the messages.

Do not translate:

- MiniMessage tags
- command names
- command arguments
- placeholders

Examples of placeholders include:

```txt
<player>
<graph>
<entries>
<token>
<hooks>
<storage>
<schema_version>
<online_players>
<max_players>
<node_id>
<edge_id>
<count>
<preset>
<value>
<key>
```

For example, this is valid:

```yml
graphNotFound: "<#F43F5E>No graph found for <#38BDF8><graph></#38BDF8>."
```

This is also valid:

```yml
graphNotFound: "<#F43F5E>Kein Graph für <#38BDF8><graph></#38BDF8> gefunden."
```

But this is invalid because the placeholder was translated:

```yml
graphNotFound: "<#F43F5E>Kein Graph für <#38BDF8><graphenname></#38BDF8> gefunden."
```

## Reload behavior

On reload, Brotkrumen reloads:

- the configured default language
- the hard fallback `en-us`
- languages that were already requested during the current plugin lifecycle

## Compatibility

Brotkrumen uses a schema-based localization format.

The loader does not read legacy or incompatible language files. Regenerate or migrate custom language files before using them with a newer Brotkrumen version.

## Contributing new languages

Brotkrumen can include additional bundled language files through community contributions.

To add a new language, create a new localization file in the `language/` resources folder using the locale tag as the file name.

For example:

```txt
language/de-DE.yml
language/fr-FR.yml
language/es-ES.yml
```

Use the existing `en-US.yml` file as a template and translate only the message text.

Do not change:

- MiniMessage tags
- command names
- command arguments
- placeholders
- `schema_version`
- `locale`, except to match the new file locale

:::danger[Keep schema metadata valid]
The `schema_version` must stay unchanged.

The `locale` value must match the locale of the language file you are adding. For example, `language/de-DE.yml` should use:

```yml
schema_version: 1
locale: "de-DE"
```

Changing these values incorrectly may prevent the language file from loading.
:::

After creating the language file, commit your changes and open a pull request.

Please include the following in your pull request:

- the new language file
- the locale tag used by the file
- a short note whether the translation is complete or still partial

Example commit message:

```txt
Add German localization
```
