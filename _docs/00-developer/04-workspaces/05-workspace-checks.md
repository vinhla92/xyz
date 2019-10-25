---
title: Workspace Checks
subtitle: Workspace Checks
tag: developer
tags: [developer]
layout: root.html

---

A couple of checks are performed whenever the workspace is loaded into memory. This happens during the boot sequence or when the workspace is modified by an administrator.

The results of the workspace checks are logged on the backend.

```bash
------Checking Workspace------
NE.OSM (tiles) => 'A-ok'
NE.COUNTRIES | dev.natural_earth_countries.geom_3857 (mvt) => 'A-ok'
NE.COUNTRIES | dev.natural_earth_countries.id (mvt) => 'A-ok'
NE.COUNTRIES | dev.natural_earth_countries__mvts (mvt cache) => 'A-ok'
GB.OSM (tiles) => 'A-ok'
GB.edit_layer | dev_edit.geom_3857 (mvt) => 'A-ok'
GB.edit_layer | dev_edit.id (mvt) => 'A-ok'
GB.edit_layer | dev_edit__mvts (mvt cache) => Cache table created
GB.oa | dev_oa.geom_3857 (mvt) => 'A-ok'
GB.oa | dev_oa.id (mvt) => 'A-ok'
GB.oa | dev_oa__mvts (mvt cache) => Cache table has been truncated
!!! GB.retail_places | dev_retailplaces.geom_3857_ (mvt) => column "geom_3857_" does not exist
GB.retail_points | dev_retailpoints.geom (cluster) => 'A-ok'
!!! GB.retail_points | dev_retailpoints.___id (cluster) => '¡No bueno!'
GB.grid | gb_hx_64k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_32k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_16k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_8k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_4k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_2k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_1k.geomcntr (grid) => 'A-ok'
GB.grid | gb_hx_1k.geomcntr (grid) => 'A-ok'
GB.Mapbox Base (tiles) => 'A-ok'
-----------------------------
```

**Errors are prefixed with !!!**

The workspace checks whether tiles can be retrieved from a 3rd party provider. Otherwise **¡No bueno!**. This could indicate a mistake in the URL or a missing environment key.

Cache tables for MVTs are either created if none exist or truncated if the mvt\_fields schema mismatches.

The geometry and query id fields for PostGIS tables are checked.

[**A-ok**](https://en.wikipedia.org/wiki/A-ok) indicates that the layer is in good working condition.

## \_defaults.json

Checks are run against the [defaults](https://github.com/GEOLYTIX/xyz/blob/master/workspaces/_defaults.json) in the workspace directory.

Keys which are not defined in the defaults will be prefixed with a double underscore \_\_.

Entries which are not 'optional' are written from the defaults into the workspace before it is loaded into memory.
