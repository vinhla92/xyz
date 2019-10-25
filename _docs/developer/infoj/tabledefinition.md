---
title: Table Definition
subtitle: Filter
tag: developer
tags: [developer]
layout: root.html
---

Location may have its own table view presenting relevant data when selected. Location table visibility can be toggled on and off from selection:

![](../../../assets/img/table_definition_1.png)

Data are calculated against additional geometries which are associated with the location. They can use values calculated within subqueries as well as fixed expressions not related spatially.

```text
"infoj": [
  {
    "type": "tableDefinition",     // defines table
    "title": "Age Profile",        // required and unique within infoj
    "columns": [],
    "rows": [],
    "agg": []                      // optional
  }
]
```

`"title"` is a required parameter and must be unique within `infoj` definition. The `tableDefinition` object has 3 children: `columns` and `rows`. `agg` is optional property and can store values which need to be calculated from query results.

`"columns"` stores geometry objects which will be used to calculate spatial aggregate. Configuration below creates 3 geometry columns for 5, 10, 15 minute drive time.

```text
"columns": [
                {
                  "type": "integer",            // PostgreSQL data type to return, defaults to "text"
                  "label": "0-5 mins",          // Nice column header, optional
                  "field": "min5",              // unique column alias, required
                  "lookup": {                   // see lookup section
                    "table_a": "sites",
                    "table_b": "gb_hx_1k",
                    "geom_a": "isoline_5min",
                    "geom_b": "geomcntr"
                  }
                },
                {
                  "type": "integer",
                  "label": "0-10 mins",
                  "field": "min10",
                  "lookup": {
                    "table_a": "sites",
                    "table_b": "gb_hx_1k",
                    "geom_a": "isoline_10min",
                    "geom_b": "geomcntr"
                  }
                },
                {
                  "type": "integer",
                  "label": "0-15 mins",
                  "field": "min15",
                  "lookup": {
                    "table_a": "sites",
                    "table_b": "gb_hx_1k",
                    "geom_a": "isoline_15min",
                    "geom_b": "geomcntr"
                  }
                }
```

In order to include total aggregate value \(like 'UK Total' column in the example\) another column object must be added with the following setup:

```text
"columns": [
  {
    "field": "uk",  // PostgreSQL alias, required and unique column alias
    "aspatial": "age_under_18_uk, age_18to24_uk, age_25to29_uk, age_30to44_uk ,age_45to59_uk, age_60plus_uk, age_total_uk FROM public.report_summary" 
  } 
]
```

`"aspatial"` contains a query which returns fixed values in a subquery. These values are stored in a separated table they can be queried from to avoid unnecessary calculation on the fly.

`"rows"` stores fields or expressions for each row of the table.

```text
"rows": [
                {
                  "field": "age_under_18", // PostgreSQL alias, required and unique column alias
                  "label": "< 18",         // nice label to display, optional
                  "fieldfx": "SUM(pop__11 - age_18to19__11 - age_20to24__11 - age_25to29__11 - age_30to44__11 - age_45to59__11 - age60plus)"
                },
                {
                  "field": "age_18to24",
                  "fieldfx": "SUM(age_18to19__11 + age_20to24__11)",
                  "label": "18 to 24"
                },
                {
                  "field": "age_25to29",
                  "fieldfx": "SUM(age_25to29__11)", // SQL statement aliased with field property
                  "label": "25 to 29"
                },
                {
                  "field": "age_30to44",
                  "fieldfx": "SUM(age_30to44__11)",
                  "label": "30 to 44"
                },
                {
                  "field": "age_45to59",
                  "fieldfx": "SUM(age_45to59__11)",
                  "label": "45 to 59"
                },
                {
                  "field": "age_60plus",
                  "fieldfx": "SUM(age60plus)",
                  "label": "60+"
                },
                {
                  "field": "age_profile_total",
                  "fieldfx": "SUM(pop__11)",
                  "label": "Total"
                }
              ]
```

"agg" is an optional parameter and it stores columns calculated from query results \(i. e. "rows"\). In the table above there are 3 columns based on either calculation from results or aspatial column: % with 15 min and Age Profile Index both based on 15 minute catchment results and UK Total which is an aspatial \(fixed\) value for each row.

For those 3 sets of values the configuration below was used:

```text
"agg": {
          "share15": { // key is unique column alias
              "label": "% with 15 min",
              "type": "integer",
              "rows": [
                "100*min15.age_under_18/min15.age_profile_total", // expression for each row
                "100*min15.age_18to24/min15.age_profile_total",
                "100*min15.age_25to29/min15.age_profile_total",
                "100*min15.age_30to44/min15.age_profile_total",
                "100*min15.age_45to59/min15.age_profile_total",
                "100*min15.age_60plus/min15.age_profile_total",
                "100*min15.age_profile_total/min15.age_profile_total"
              ]
          },
          "age_uk_total": {
              "label": "UK Total",
              "type": "integer",
              "rows": [
                "uk.age_under_18_uk",
                "uk.age_18to24_uk",
                "uk.age_25to29_uk",
                "uk.age_30to44_uk",
                "uk.age_45to59_uk", 
                "uk.age_60plus_uk", 
                "uk.age_total_uk"
              ]
          },
          "age_index": {
              "label": "Age Profile Index",
               "type": "numeric(1000, 2)",
               "rows": [
                  "uk.age_total_uk*(100*min15.age_under_18/min15.age_profile_total)/uk.age_under_18_uk",
                  "uk.age_total_uk*(100*min15.age_18to24/min15.age_profile_total)/uk.age_18to24_uk",
                  "uk.age_total_uk*(100*min15.age_25to29/min15.age_profile_total)/uk.age_25to29_uk",
                  "uk.age_total_uk*(100*min15.age_30to44/min15.age_profile_total)/uk.age_30to44_uk",
                  "uk.age_total_uk*(100*min15.age_45to59/min15.age_profile_total)/uk.age_45to59_uk",
                  "uk.age_total_uk*(100*min15.age_60plus/min15.age_profile_total)/uk.age_60plus_uk",
                  "uk.age_total_uk*(100*min15.age_profile_total/min15.age_profile_total)/uk.age_total_uk"
                ]
              }
            }
```
## Sorting

Table sort requests will now be sent to the backend.
If you show 99 out of n records then the 99 records will be retrieved after sorting.

## Viewport Flag

Layer table now has a viewport flag, which is set to false by default. This can be toggled with a button in the tableview control itself.

![](../../../assets/img/table_definition_2.png)

When the viewport is off, the layer table will not update with viewport changes since all data is down.

This will work together with sorting the layer table.

![](../../../assets/img/table_definition_3.png)

## Selecting Location

You can select a row in the table view that will point to said location on the map.

![](../../../assets/img/table_definition_4.png)