---
title: Radar charts
subtitle: Radar
author: agata
tags: [developer]
layout: developer.html
---


## Radar charts

```text
"chart": {
	"type": "radar"
}
```

Radar charts show several data points and are used for comparison between multiple data series.

Radar chart inherits all options listed in the introduction to charts.

Find below an example of a radar chart comparing variation between 2 data series:

```text
{
	"label": "Radar Chart",
	"type": "group",
	"chart": {
		"type": "radar",
		"backgroundColor": ["rgba(233, 30, 99, 0.3)", "rgba(3, 169, 244, 0.3)"],
		"borderColor": ["rgba(233, 30, 99, 0.7)", "rgba(3, 169, 244, 0.7)"]
		}
	},
	{
		"group": "Radar Chart",
		"field": "actual_sales_activity1_radar",
		"type": "integer",
		"label": "Activity 1",
		"dataset": "Actual"
	},
	{
		"group": "Radar Chart",
		"field": "actual_sales_activity2_radar",
		"type": "integer",
		"label": "Activity 2",
		"dataset": "Actual"
	},
	{
		"group": "Radar Chart",
		"field": "actual_sales_activity3_radar",
		"type": "integer",
		"label": "Activity 3",
		"dataset": "Actual"
	},
	{
		"group": "Radar Chart",
		"field": "model_sales_activity1_radar",
		"type": "integer",
		"label": "Activity 1",
		"dataset": "Model"
	},
	{
		"group": "Radar Chart",
		"field": "model_sales_activity2_radar",
		"type": "integer",
		"label": "Activity 2",
		"dataset": "Model"
	},
	{
		"group": "Radar Chart",
		"field": "model_sales_activity3_radar",
		"type": "integer",
		"label": "Activity 3",
		"dataset": "Model"
	}
``` 