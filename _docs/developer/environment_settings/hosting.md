---
title: Hosting
subtitle: Hosting

tags: [developer]
layout: developer.html
---

The XYZ node.js backend must be hosted on a server or in a serverless environment. Following environment keys are recognised to define the hosting environment.

`"PORT": "3000"`

The port on which the application is run. Defaults to 3000.

`"DIR": "/open"`

The path for the application root. Aliased to geolytix.xyz the application will be accessible via [geolytix.xyz/open](https://geolytix.xyz/open). By default the access can only be accessed on the root of the domain.

`"HTTP": "http"`

By default all XYZ routes will be secure \(https\). The HTTP flag can be set to allow http connections in a local environment for debugging.

`"LOG_LEVEL": "info"`

Setting the LOG\_LEVEL to info will force the backend and client to produce additional logs which can be used for debugging.