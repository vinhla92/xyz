---
title: Now Deployments
subtitle: Zeit
tag: infrastructure
tags: [infrastructure]
layout: root.html

---

## Deploying serverless with Zeit Now

Node/npm will be required on your machine in order to deploy XYZ. Installing node will vary depending on your operating system. npm is required to install the [Zeit Now CLI](https://github.com/zeit/now-cli).

With the Zeit Now CLI installed an XYZ instance can be deployed directly from the GitHub repository.

```text
now geolytix/xyz
```

This will deploy the XYZ master branch from the GitHub repository with zero configurations.

![](../../assets/img/gifs/xyz_now_deploy.gif)

You can now follow the link from the now deployment output and will see the zero configuration map in your browser.

![](../../assets/img/deployment_1.png)

[Zeit Now environment variables](https://zeit.co/docs/features/env-and-secrets) can be added using the -e option. These environment variables which are available to the Node process allow to configure a custom environment for a deployment.

```bash
now geolytix/xyz \
-e DIR="/demo" \
-e ALIAS=”geolytix.xyz” \
-e PRIVATE="postgres://user:***@pg.xyz.geolytix.net:5432/xyz|demo.users" \
-e SECRET="***" \
-e TRANSPORT="smtps:xyz%40geolytix.co.uk:***@smtp.gmail.com" \
-e WORKSPACE="postgres://user:***@pg.xyz.geolytix.net:5432/xyz|demo.settings" \
-e DBS_XYZ="postgres://user:***@pg.xyz.geolytix.net:5432/xyz" \
-e KEY_MAPBOX="access_token=**.***.***"
```