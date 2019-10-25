---
title: Access Control
subtitle: Access Control
tag: developer
tags: [developer]
layout: root.html
---

Access control entries in the environment settings define the connection details for the ACL table and which access level are given to the Client Interface and API.

`"PUBLIC": "postgres://username:password@123.123.123.123:5432/database|schema.table"`

[**Client and API access**](../../access/access/) are defined with either the `"PUBLIC"` or `"PRIVATE"` environment entry. Public access without the possibility of administrative access is the default if no access environment entry is provided.

Public access with a [pg-connection-string](https://github.com/iceddev/pg-connection-string) which references a PostgreSQL table allows for private and administrator accounts to be used alongside public access. Setting a private environment variable for access disables public access and requires user to login in order to receive a token for private or administrative access.

The user account defined in the PostgreSQL connection string must have the privilege to create and edit records in order to manage user accounts through the XYZ backend. The backend will create a new ACL table if the defined table does not exist. For this to succeed, the PostgreSQL account must have the necessary roles to create tables in the defined schema.

`"TRANSPORT": "smtps://xyz%40geolytix.co.uk:password@smtp.gmail.com"`

An SMTP connection string which is required by the [nodemailer](https://nodemailer.com/smtp) module to send emails. The XYZ backend must be able to send emails in order for user to register and verify their accounts. Registration will work without the transport entry declared but administrator must manually override account verification.

`"ALIAS": "geolytix.xyz"`

The domain alias to be used in email notifications. Without an alias defined the application will reference the [host value from the request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host).

`"FAILED_ATTEMPTS": "3"`

The maximum number of [**failed attempts**](../../access/failed-login-attempts/) before a user account is locked. Defaults to 3.

`"SECRET": "ChinaCatSunflower"`

A secret which is required to sign and verify [**access token**](../../../../infrastructure/security/jwt-token/) which are used to decorate requests from the client to secure API endpoints.