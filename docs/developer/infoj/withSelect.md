---
title: With Select
subtitle: With Select

tags: [developer]
layout: developer.html
---

This property allows returning values calculated on the fly from other `infoj` entries. 

Consider the example below:

```text
{
    "label": "Population",
    "field": "pop__17", // known value
    "type": "numeric"
},
{
    "label": "Competitors",
    "field": "comp", // known value
    "type": "integer"
},
{
    "label": "Population per competitor",
    "field": "field_withSelect", // PostgreSQL calculation result alias
    "fieldfx": "pop__17 / comp", // calcutation to perform
    "type": "integer",
    "withSelect": true
}
```

Each feature on this layer calculates "Population per competitor" ratio of two given values when requested.

When used with cross layer queries \(i.e. lookups\) returns result with along with defined spatial condition.
