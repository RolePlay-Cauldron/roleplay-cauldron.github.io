---
title: Storage
description: Configure Brotkrumen data storage
---

# Storage

Brotkrumen stores plugin data using the storage backend configured in `config.yml`.

By default, Brotkrumen uses SQLite. This is the recommended option for most servers because it does not require any additional setup.

## Configuration path

The storage configuration is located under the `data` section:

```yml
################
# Data Storage #
################

data:

  # The desired storage-method for the plugin data.
  storageMethod: 'sqlite'
```

## Available storage methods

Brotkrumen currently supports the following storage methods:

| Storage method | Description |
|---|---|
| `sqlite` | Local database file. No extra configuration required. |
| `mysql` | Remote MySQL database. Requires connection information. |
| `mariadb` | Remote MariaDB database. Requires connection information. |

SQLite is the default storage option and should work out of the box.

## SQLite

To use SQLite, keep the storage method set to `sqlite`:

```yml
data:
  storageMethod: 'sqlite'
```

No database host, username, password, or connection pool settings are required for SQLite.

This is the easiest setup and is recommended for small to medium-sized servers or servers that do not need a shared external database.

## MySQL and MariaDB

To use MySQL or MariaDB, change `storageMethod` to either `mysql` or `mariadb`.

Example:

```yml
data:
  storageMethod: 'mysql'

  tablePrefix: 'brotkrumen'

  host: 'localhost'
  port: 3306

  database: 'minecraft'

  user: 'user'
  password: 'pw'
```

For MariaDB, use:

```yml
data:
  storageMethod: 'mariadb'
```

:::danger[Database must exist]
For remote database storage, the database must be created manually before starting the plugin.

Brotkrumen will create the required tables automatically, but it will not create the database itself.
:::

## Table prefix

The `tablePrefix` option controls the prefix used for Brotkrumen database tables.

```yml
data:
  tablePrefix: 'brotkrumen'
```

Brotkrumen will automatically create tables with this prefix if they do not already exist.

:::warning[Changing table prefixes]
Changing `tablePrefix` after data has already been created does not automatically rename existing tables.

If you change the prefix, Brotkrumen may create a new set of tables and existing data may appear to be missing until the configuration or database is migrated manually.
:::

## Remote database connection

Remote storage methods require connection information:

```yml
data:
  host: 'localhost'
  port: 3306

  database: 'minecraft'

  user: 'user'
  password: 'pw'
```

| Option | Description |
|---|---|
| `host` | Address of the database server. |
| `port` | Port of the database server. Usually `3306` for MySQL and MariaDB. |
| `database` | Name of the database where Brotkrumen stores its data. |
| `user` | Database username. |
| `password` | Database password. |

## Connection pool settings

The `poolSettings` section controls the database connection pool for MySQL and MariaDB.

```yml
data:
  poolSettings:
    maximumPoolSize: 10
    minimumIdle: 10
    maximumLifetime: 1800000
    keepAliveTime: 0
    connectionTimeout: 5000
```

:::danger[Advanced settings]
Do not change the connection pool settings unless you know what you are doing.

Incorrect pool settings can cause database connection issues, timeouts, or unnecessary load on your database server.
:::

### Pool options

| Option | Description |
|---|---|
| `maximumPoolSize` | Maximum number of database connections in the pool. |
| `minimumIdle` | Minimum number of idle connections the pool tries to maintain. |
| `maximumLifetime` | Maximum lifetime of a connection in milliseconds. |
| `keepAliveTime` | Interval used to keep connections alive. Set to `0` to disable keepalive. |
| `connectionTimeout` | Maximum time in milliseconds Brotkrumen waits for a database connection. |

The default values are suitable for most servers.

## Full storage example

```yml
################
# Data Storage #
################

data:

  # The desired storage-method for the plugin data.
  #
  # Possible options:
  #
  # | Flat-file / local database - no extra configuration needed
  # | => SQLite
  #
  # | Remote databases - requires connection information.
  # | => MySQL
  # | => MariaDB
  #
  # A SQLite database is the default storage option.
  storageMethod: 'sqlite'

  # The following options are only relevant for remote database storage methods.

  # The prefix for the tables in the database.
  # The plugin will automatically create tables with this prefix if they do not exist yet.
  # In migration scenarios, the plugin will not automatically rename the table prefix.
  tablePrefix: 'brotkrumen'

  # The default address and port for the database.
  host: 'localhost'
  port: 3306

  # The name of the database to store Brotkrumen data in.
  # The database has to be created manually before the first plugin startup.
  database: 'minecraft'

  # The credentials for the database.
  user: 'user'
  password: 'pw'

  # These settings apply to the MySQL or MariaDB connection pool.
  # The default values are suitable for the majority of users.
  # DO NOT change these settings unless you know what you are doing.
  poolSettings:

    maximumPoolSize: 10
    minimumIdle: 10
    maximumLifetime: 1800000
    keepAliveTime: 0
    connectionTimeout: 5000
```

## Recommendations

Use `sqlite` if you want a simple setup without external dependencies.

Use `mysql` or `mariadb` if you run a larger server network, want centralized storage, or need to access the same Brotkrumen data from an external database system.