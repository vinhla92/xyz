---
title: Simple charts
subtitle: Line, bars...
author: agata
tags: [developer]
layout: developer.html
---


## Simple charts

Simple charts expression refers to 'line', 'bar' and 'horizontalBar'. 

These chart types inherit all options listed in the introductory chapter. The default behaviour is to display one data series. Multiple series are also supported.

In order to display multiple series group entries need "dataset" property. This is a string value.
Find below test entries organized in 2 data series:

```text
"infoj": [{
  "label": "Random data series",
  "type": "group"
  },
  {
    "group": "Random data series",
    "label": "Random 1",
    "field": "random1",
    "type": "integer",
    "dataset": "Serie 1"
  },
  {
    "group": "Random data series",
    "label": "Random 2",
    "field": "random2",
    "type": "integer",
    "dataset": "Serie 1"
  },
  {
    "group": "Random data series",
    "label": "Random 3",
    "field": "random3",
    "type": "integer",
    "dataset": "Serie 2"
  },
  {
    "group": "Random data series",
    "label": "Random 4",
    "field": "random4",
    "type": "integer",
    "dataset": "Serie 2"
  }
]
```

Simple chart also supports "mixed" type. "Mixed" is using both lines and bars to display logically linked data series.

In order to use "mixed" charts set chart type to "mixed". Subsequently set "chartType" string parameter on each group entry. Meaningful values are "line" and "bar" with "line" being the default value.

If you use "mixed" type with multiple series settings for background and border colours are both arrays where length follows the number of your data series:

```text
{
  "label": "Random data series",
  "type": "group",
  "chart": {
    "type": "mixed",
    "title": true,
    "legend": true,
    "legendPosition": "bottom",
    "backgroundColor": ["rgba(192, 117, 205, 0.3)", "rgba(255, 167, 38, 0.3)"], // 2 data series defined
    "borderColor": ["#4a148c", "#e65100"]
  }
}
```