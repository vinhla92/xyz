---
title: Workspaces
subtitle: This document covers the Introduction of Workspaces
class: first
tag: developer
tags: [developer]
layout: root.html

---

A workspace is a configuration of services, locales, layers and locations which are used in a deployment.

A service is a plugin which is accessible from the application root. e.g. The ability to [**locate**](../locate/) a device position on the map.

[**Layers**](../../layers/layers) are defined within [**locales**](../../locales/locales/). A locale is defined by its extent \(bounds and zoom level\). A locale may have services itself. e.g. The [**gazetteer**](../../locales/gazetteer/) geolocation service.

Locations are defined by an [**InfoJ**](../../infoj/infoj/) schema on the layer through which a location can be accessed.

**Workspaces are served from memory.** During startup a workspace will be loaded into memory from either a file or a PostgreSQL tables. A minimum configuration will be loaded into memory if no workspace is defined or if the backend is not able to parse a valid JSON document.

Workspaces will be checked before they are loaded into memory. Invalid keys or objects will be prefixed by \_\_. These objects are ignored by the XYZ client. Layers will be checked for their connectivity. Layers which cannot be queried will be invalidated.

Workspaces provided in the GitHub repository require GEOLYTIX database connections and 3rd party provider keys registered to GEOLYTIX. Layers from these workspaces will be invalid without their matching database connection strings.

The workspace can be loaded through workspace admin views. The workspace admin views allow to upload workspace files and load the workspace into the instances memory.

## **/workspace/admin**

A [jsoneditor](https://github.com/josdejong/jsoneditor) tree view which allows administrator to modify workspaces which are stored in a PostgreSQL table.

![jsoneditor tree view](../workspaces_1.png)

## **/workspace/admin/json**

A [jsoneditor](https://github.com/josdejong/jsoneditor) code view which allows administrator to modify workspaces which are stored in a PostgreSQL table.

![jsoneditor code view](../workspaces_2.png)