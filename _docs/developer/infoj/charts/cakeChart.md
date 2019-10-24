---
title: Cake charts
subtitle: Pie and doughnut
author: agata
tags: [developer]
layout: developer.html
---


## Cake charts

Cake refers to pie and doughnut charts meant for display of several values that sum up to a whole. Chart type values are "pie" and "doughnut". They do not support multiple series.

```text
"chart": {
	"type": "pie"
}
```

Options listed in the chart introduction are supported here.

If you are using a doughnut you can set "cutoutPercentage" value which set the size of the doughnut hole. Defaults to 50.

```text
"chart": {
	"type": "doughnut",
	"cutoutPercentage": 40
}
```