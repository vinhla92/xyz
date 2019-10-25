---
title: Environment Settings
subtitle: Intro to Environment Settings
class: first
tag: developer
tags: [developer]
layout: root.html
---

The process environment contains sensitive information such as connection strings for data sources, security information and API keys. These should never be made public and are not contained in this repository.

Running the application without any environment settings \(zero-configuration\) will host a sample application with a single OSM base layer on port 3000.

The environment settings are usually defined as entries which are passed to the hosting environment in the [**deployment**](../../deployment/deployment/) instructions.