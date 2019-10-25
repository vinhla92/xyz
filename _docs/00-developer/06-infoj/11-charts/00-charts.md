---
title: Charts
subtitle: Charts
author: agata
class: second
tag: developer
tags: [developer]
layout: root.html
---

## Charts

Grouped elements can be displayed as charts.

There are several chart types to use with a selected location: 

- line (default)
- bar
- mixed (line + bar)
- horizontalBar
- pie
- doughnut
- radar
- polarArea
- stackedBar


Chart `"type"` defaults to `"line"`. Charts are built using [Chart.js](https://www.chartjs.org/docs/latest/) where all underlying and supported chart types are documented. 

By default, a group is displayed in a table and can be switched to chart view when clicking a chart icon. In order to make chart displayed by default set "active" to true:

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "active": true
}
```

Chart title will be hidden by default. In order to display chart title set "title" flag to true.

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "active": true,
  "title": true
}
``` 

If data values run in big numbers and take space on left margin they can be scaled by setting `"unit"` property. Supported values are `"k"` for thousands and `"M"` for millions.

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "active": true,
  "title": true,
  "unit": "k"      // y-Axis will be scaled to thousands
}
``` 

![Bar chart with scaled y-values.](../../../../assets/img/infoj_groups_2.png)


In order to give chart data series colours set the following properties:

```text
"chart": {
  "type": "horizontalBar",
  "x": "label x",
  "y": "label y",
  "backgroundColor": ["#FFA630", "#C6DEA6", "#7EBDC3", "#7A6263", "#CED097"],
  "borderColor": ["#FFA630", "#C6DEA6", "#7EBDC3", "#7A6263", "#CED097"],
  "height": 400    // set chart height to 400px.
}
```

![Horizontal bar chart with custom colours.](../../../../assets/img/infoj_groups_3.png)

Both properties take either single colour as string or array of colours. Colours can be given in either Hex, RGB, RGBA or HSL. **In order to set colour or fill opacity use RGBA format.**

Legend is hidden by default. In order to display legend: 

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "legend": true,
  "legendPosition": "left | right | bottom | top" // defaults to 'left'.
}
```

Charts by default will begin at a value slightly below minimum. In order to keep y-Axis at zero set the following parameter:

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "beginAtZero": true   // chart values will now begin at zero.
}
```

Charts also have tooltip aligning parameters. In order to change default tooltip alignment set the following parameters:

```text
"chart": {
  "xAlign": "left | right | bottom | top",
  "yAlign": "left | right | bottom | top"
}
```

