---
title: Ubuntu Deployments
subtitle: Ubuntu Server
tag: infrastructure
tags: [infrastructure]
layout: root.html

---

## Deploying on a Ubuntu server

For deployments on Ubuntu we use the [PM2](https://github.com/Unitech/pm2) process manager to run multiple instances of the framework on different ports on the same server. Environment settings for PM2 instances can be provided from a JSON document.

```bash
pm2 start myapplication.json
``