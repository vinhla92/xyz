---
title: Geometry
subtitle: Geometry
tag: developer
tags: [developer]
layout: root.html
---
It is possible to assign geometry fields as infoj entries.

```text
{
  "field": "geom_rplace",
  "fieldfx": "ST_asGeoJson(geom_rplace)",
  "type": "geometry",
  "display": true, // defaults to null
  "style": {
    "stroke": true,
    "color": "#cf0",
    "weight": 2,
    "fill": true,
    "fillOpacity": 0.5
  }
}
```

```display: true```  
If defined additional geometries will be displayed immediately on selection. Immediate display is suppressed by default. This parameter is relevant to non-editable additional geometries only.

A geojson geometry from a geometry field will be displayed with the **style** defined in the infoj entry. The default style will be the defined by the record itself. A **fieldfx** function can be used to turn PostGIS geometries into geojson on the fly.

```text
"name": "Create isoline"
```

Additional geometry has its respective checkbox for creating/deleting/recreating if editing in enabled on the feature. If no editing is set the checkbox has Show/Hide function. "name" property sets label for checkbox. If unset defaults to "Additional geometries". 

![](../../../assets/img/infoj_geometry_1.png)

![](../../../assets/img/infoj_geometry_2.png)