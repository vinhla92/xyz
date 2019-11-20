---
title: Workspace Connections
subtitle: Workspace Connections
tag: developer
tags: [developer]
layout: root.html
---

A [**workspace**](../../workspaces/workspaces/) and associated database connections must be defined in the environment settings.

`"WORKSPACE": "postgres://username:password@123.123.123.123:5432/database|schema.table"`

The WORKSPACE key value is a [pg-connection-string](https://github.com/iceddev/pg-connection-string) plus table definition. A table with a zero configuration workspace will created if the table does not exist. The database user must have privileges to create a new table in the defined schema and add records to the workspace table.

Below is the PostgreSQL schema for workspace tables.

```sql
create table settings
(
	"_id" serial not null,
	settings json
);
```

## **Workspace files**

`"WORKSPACE": "file:demo.json"`

With the `file:` prefix the server will look for a workspace document in the [in the workspaces directory](https://github.com/GEOLYTIX/xyz/tree/master/workspaces) of the repository. Serving a workspace from a file makes it impossible to modify the workspace which is loaded into the backend memory.

## **PostGIS Database Connections**

Connection strings must be provided for all data sources which are referenced in a workspace.

`"DBS_XYZ": "postgres://username:password@123.123.123.123:5432/database"`

Keys beginning with DBS\_ store PostGIS data source connections. During [**startup**](../../../../infrastructure/server/) the keys are used to register PostgreSQL database connections. The remainder of the `"DBS_***"` string is the key for the database connection. This key must be referenced as the dbs parameter in workspace [**layer**](../../layers/layers/) definitions.