---
title: Lookups
subtitle: Lookups
tag: developer
tags: [developer]
layout: root.html
---

Lookups can be used to create aggregate values based on geometry checks.

The [PostgreSQL **aggregate** ](https://www.postgresql.org/docs/current/functions-aggregate.html) function is used for the aggregation of values which match the spatial lookup condition. The aggregate function will default to SUM. The aggregate function must be part of the function if `"fieldfix":` is defined. If not defined the aggregate function must form part of the `"lookup":`

See examples below.

```text
{
  "label": "OA pop_11",
  "field": "pop_11_",
  "type": "integer",
  "lookup": {
    "table_a": "dev_polygons",
    "geom_a": "a.geom",
    "table_b": "schema.dev_points",
    "geom_b": "b.geomcntr",
    "condition": "ST_INTERSECTS",
    "aggregate": "AVG"
  }
}
```

_fig 1. \(Look up that makes use of aggregate function\)_ 

```text
{
  "label": "Population Growth % (2011-17)",
  "field": "pop_growth_11_17_5min",
  "fieldfx": "SUM(b.pop__17 - b.pop__11) * 100 / SUM(b.pop__11)",
  "type": "numeric",
  "lookup": {
      "table_a": "schema.table_a",
      "table_b": "schema.table_b",
      "geom_a": "isoline_5min",
      "geom_b": "geomcntr"
  }
}
```

_fig 2. \(Function field that overrides the aggregate\)_

**table\_a** must be the table which holds the location as defined by an ID in the lookup query.

**table\_b** must be in the same database but can be in a different schema.

Geometries must be fixed with a. or b. to prevent ambiguous lookups.

**geom\_a** can be translated to match the epsg of geom\_b.

`"geom_a": "ST_Transform(ST_Setsrid(a.geom, 4326), 3857)"`

It is highly recommended that **geom\_b** has a spatial index.

The lookup **condition** must be a PostGIS function which takes the locations geometry as first input and the lookup geometry as the second input. The condition will default to [ST\_Intersects](https://postgis.net/docs/ST_Intersects.html).


