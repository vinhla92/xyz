---
title: Cluster Area
subtitle: Properties from underlying geometry.
tags: [developer]
layout: root.html
---


`"clusterArea"`  allows to access properties from an underlying geometry. This is useful for returning characteristics of an area where a point of interest is located.

`"clusterArea"` will include value in the _cluster_ layer `"infoj"`.

**This tool is supported by cluster layers.**


See example below.

```text

    {
      "label": "Locality",               // label to display
      "field": "intersecting_locality",  // field alias
      "fieldfx": "locality",             // expression
      "inline": true,                    // value displayed in one line in the listview
      "clusterArea": {
        "area": "public.localities",     // table to return data on underlying area
        "cluster": "site_list",          // cluster table 
        "area_geom": "geom_4326",        // respective geometries
        "cluster_geom": "geom",
        "condition": "ST_Contains"       // defaults to ST_INTERSECTS
        }
    }
```


This entry returns only 1 result. For non-cluster layers the entry will be ignored. For aggregate values see [lookups](./lookups.md) chapter. 