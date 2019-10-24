---
title: Groups
subtitle: Groups

tags: [developer]
layout: developer.html
---

`infoj` entries can be grouped for a more structured visual display in the location's info drawer.

```text
"infoj": [
  {
    "label": "Group A",
    "type": "group",
    "expanded": true
  },
  {
    "group": "Group A",
    "label": "Size",
    "field": "size_sqm",
    "type": "integer"
  },
  {...}
]
```

Groups are created by defining an entry as `"type" : "group"`. **A group must have a unique label**. Any subsequent entry can be added to a previously defined group by assigning the group's label to the `group` key of the entry that should be added to the group.

By default, groups are displayed in a collapsed state that shows just the group label and hides all its entries. To overwrite this behaviour, set the group's `expanded` option to `true`.

## Charts

Grouped integer and numeric values can be displayed as a chart by defining the chart type in the group's entry. Default chart settings:

```text
"chart": {
  "x": "label x",
  "y": "label y"
}
```

![Default chart.](../../../assets/img/infoj_groups_1.png)

Chart `"type"` defaults to `"line"`. Charts are built using [Chart.js](https://www.chartjs.org/docs/latest/) where all supported chart types are documented. If data values run in big numbers and take space on left margin they can be scaled by setting `"unit"` property. Supported values are `"k"` for thousands and `"M"` for millions.

![Bar chart with scaled y-values.](../../../assets/img/infoj_groups_2.png)

In order to give chart data series colours set the following properties:

```text
"chart": {
  "type": "horizontalBar",
  "x": "label x",
  "y": "label y",
  "backgroundColor": ["#FFA630", "#C6DEA6", "#7EBDC3", "#7A6263", "#CED097"],
  "borderColor": ["#FFA630", "#C6DEA6", "#7EBDC3", "#7A6263", "#CED097"],
  "excludeNull": true // removes null entries from chart data
}
```

![Horizontal bar chart with custom colours.](../../../assets/img/infoj_groups_3.png)

Both properties take either single colour as string or array of colours. Colours can be given in either Hex, RGB or HSL.

Legend is hidden by default. In order to display legend: 

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "legend": true
}
```

By default, a group is displayed in table view, and can be switched to chart view when clicking an icon. To swap this behaviour, i.e. show a chart by default and allow switching to table view with the icon, add the `active` option to the chart object:

```text
"chart": {
  "x": "label x",
  "y": "label y",
  "active": true
}
```

#### Stacked bar chart

Charts of type `bar` and `horizontalBar` support data visualised in stacks.

![Two data stacks](../../../assets/img/infoj_groups_4.png)

In order to define a stacked chart:

* set `"stack"` property to one of the `stacks` values in each group item
* set `"backgroundColor"` or `"borderColor"` to array of colours to use for respective stacks
* important: `label` within group must be consistent across stacks.

```text
{
              "label": "Sales",
              "type": "group",
              "chart": {
                "active": true,
                "type": "bar",
                "backgroundColor": ["#FFA630", "#C6DEA6"],
                "borderColor": ["#FFA630", "#C6DEA6"]
              }
            },
            {
              "group": "Sales",
              "label": "Eat In Weekday",
              "field": "actual_sales_eat_in_leisurely_weekday_treat",
              "type": "integer",
              "stack": "Actual Sales"
            },
            {
              "group": "Sales",
              "label": "Takeaway Weekend",
              "field": "actual_sales_takeaway_weekend_lunch",
              "type": "integer",
              "stack": "Actual Sales"
            },
            {
              "group": "Sales",
              "label": "Eat In Weekday",
              "field": "model_sale_eat_in_leisurely_weekday_treat",
              "type": "integer",
              "stack": "Model Sales"
            },
            {
              "group": "Sales",
              "label": "Takeaway Weekend",
              "field": "model_sale_takeaway_weekend_lunch",
              "type": "integer",
              "stack": "Model Sales"
            }
```

