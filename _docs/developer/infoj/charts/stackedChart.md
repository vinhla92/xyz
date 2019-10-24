---
title: Stacked charts
subtitle: Stacked bar, horizontal bar, line...
author: agata
tags: [developer]
layout: developer.html
---


## Stacked charts

```text
"chart": {
	"type": "stackedBar | stackedHorizontalBar | stackedLine"
}
```

Stacked charts are meant to display cumulative value of each data series.  
Arrays of colours used for chart styling should follow number of defined data series.
Each group entry gets "stack" string property which locates the entry within the respective stack. 

Note that labels for the same data point must be consistent across stacks.

Find below an example of a stacked chart setup:

```text
{
	"label": "Stacked Chart",
	"type": "group",
	"chart": {
		"type": "stackedHorizontalBar",
		"backgroundColor": ["#FFA630", "#C6DEA6", "#0B9800", "#EC8394"],
        "borderColor": ["#FFA630", "#C6DEA6", "#0B9800", "#EC8394" ]
    }
},{
	"group": "Stacked Chart",
	"label": "Activity 1",
	"field": "actual_sales_activity1",
	"type": "integer",
	"stack": "Actual sales"
},{
	"group": "Stacked Chart",
	"label": "Activity 2",
	"field": "actual_sales_activity2",
	"type": "integer",
	"stack": "Actual sales"
},{
	"group": "Stacked Chart",
	"label": "Activity 1",
	"field": "model_sales_activity1",
	"type": "integer",
	"stack": "Model sales"
},{
	"group": "Stacked Chart",
	"label": "Activity 2",
	"field": "model_sales_activity2",
	"type": "integer",
	"stack": "Model sales"
}
```