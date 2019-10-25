---
title: Isolines
subtitle: Introduction to isolines
tag: developer
tags: [developer]
layout: root.html
---

The framework supports creation of isolines based on travel time or distance and selected location.
Isolines are provided by third party API services.
At the moment supported providers are Here and Mapbox.

```text
{
	"type": "geometry",
	"field": "", // column to store entry or desired alias, used with "fieldfx"
	"fieldfx": "", // entry column expression
	"edit": {
	    "isoline_here": {
	        "minutes": 15, // defaults to 10
	        "mode": "pedestrian"  // defaults to "car"
	    }
    }
}
```

Isolines can have predefined mode of transport (walking, driving, cycling), range type (time or distance in case of Here) and time frame. These parameters are API-specific and will vary across configurations.

Isolines support **`"slider": true`** property in order to enable custom isoline parameters. 

```text
{
	"type": "geometry",
	"field": "isoline field alias",
	"fieldfx": "ST_asGeoJson(isoline column),
	"edit": {
	    "isoline_here": {
	        "slider": true // enables custom range slider
	    }
    }
}
```

An isoline may have an associated meta data field which will store details of the most recent request sent to third party API.

```text
{
	"type": "geometry",
	"field": "",
	"fieldfx": "",
	"edit": {
	    "isoline_here": {
	        "slider": true,
	        "meta": "metadata_column" // a column of type 'json' in Postgres
	    }
    }
}
```

To include metadata on created isoline add entry to infoj list:

```text
{
	"type": "meta",
	"field": "metadata_column"
}
```

Isoline settings will be displayed only when isoline had been deleted or has not been created.

The metadata entry will be displayed only when isoline exists.
