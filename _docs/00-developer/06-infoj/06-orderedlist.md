---
title: Ordered List
subtitle: Ordered List
tag: developer
tags: [developer]
layout: root.html
---

```javascript
{ "type": "orderedList" }
```

A generic configuration of an orderedList entry:

```javascript
{
  "type": "orderedList",
  "title": "Nearest competitors",    // tab title
  "display": true,
  "table": "public.food_beverage",  // data source
  "geom": "geom",                   // geometry column
  "columns": []                     // holder for table columns
}
```

`"orderedList"` support several distinct properties:

```javascript
{
  "type": "orderedList",
  "title": "Nearest competitors",
  "display": true,
  "table": "public.food_beverage",
  "geom": "geom",
  "columns": [],
  "order": "DESC",   // ordering results, defaults to ASC / ascending
  "limit": 8,        // number of results, defaults to 100.
  "geography": true  // *
}
```

* `"geography": true` is an optional parameter used to cast PostGIS geometry datatype to geography. This was implemented in order to return metric distance from calculation on WGS84 \(SRID 4326\) geometries.

Ordered list also supports a spatial lookup if you want your results filtered spatially. See [lookups chapter.](./lookups.md)

#### Columns

```javascript
"columns": [
 {
   "title": "Competitor name",
   "field": "fascia",
   "condition": {          // allows filtering based on where clause
      "operator": "ilike", // operator defaults to 'like'
      "phrase": "%a%"      // if phrase is undefined then condition is left out 
    }
  },
  {
    "title": "Category",
    "field": "rlcategory"  // type defaults to "text"
  },
  {
    "title": "Postcode",
    "fieldfx": "postcode", // functional "fieldfx" alias supported 
    "field": "_postcode"
   },
   {
     "title": "Retail place type",
     "field": "rp_type"
    },
    {
      "type": "integer",
      "geography": true,       // casts geometries to geographies
      "title" :"Distance (m)",
      "fx": "ST_DISTANCE",     // PostGIS function to perform on both geometries
      "field": "dist",
      "orderby": true          // entry entry included in "order by" clause
     }
  ]
```

The above configuration returns a set of features from another table where names contain 'a' ordered by closest distance.


#### ID Lookup

Data displayed in the ordered list can be related by ID to the location. In order to display an ID-based list set the following:

```text
{
  "type": "orderedList",
  "title": "National results 2019",
  "display": true,
  "table": "politics.eu_national_parties",
  "rel_id": "nuts_id",  // this parameter stored relative id between location and the other data table
  "columns": [
  {
    "title": "Candidate ID",
    "field": "candidateid"
  },{
    "title": "Candidate type",
    "field": "candidatetype"
  },{
    "title": "Candidate acronym",
    "field": "candidateacronym"
  },{
    "title": "Candidate name",
    "field": "candidatelongname"
  },{
    "title": "Seats total",
    "field": "seatstotal",
    "type": "integer"
  },{
    "title": "Votes %",
    "field": "votespercent",
    "type": "numeric",
    "orderby": true
  },{
    "field": "memberofcoalition",
    "title": "Member of coalition"
  }],
  "order": "DESC"
}
```

![Selected location with ID lookup-based data in a table.](../../../assets/img/ordered_list_id_lookup.png) 
