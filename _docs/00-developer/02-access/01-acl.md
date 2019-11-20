---
title: Access Control List (ACL)
subtitle: ACL
tag: developer
tags: [developer]
layout: root.html
---

The Access Control List \(ACL\) is a PostgreSQL table which stores all private and admin user accounts.

Give the necessary roles to the PostgreSQL account defined in the environment settings the backend will generate a new ACL table from this schema.

```sql
create table if not exists users
(
	"_id" serial not null,
	email text not null,
	password text not null,
	verified boolean,
	approved boolean,
	admin boolean,
	verificationtoken text,
	approvaltoken text,
	failedattempts integer default 0,
	password_reset text,
	api text
);
```

[**XYZ security**](../../../../infrastructure/security/introduction) and strategy which depend on this ACL table schema will be discussed in detail in the [**infrastructure**](../../../../infrastructure/introduction) section of this documentation.

The connection details for the ACL must be provided in the [**Access Control Environment Settings**](../../environment_settings/access-control/).

> A default admin account **admin@geolytix.xyz** \(password: **admin123**\) will be inserted into a newly created ACL table.

> This account can be used to login and approve the first newly registered admin account. The default account should be removed as soon as a new private admin account with a valid email has been defined.