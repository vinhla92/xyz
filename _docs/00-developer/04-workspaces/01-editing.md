---
title: Editing
subtitle: Editing Workspace
tag: developer
tags: [developer]
layout: root.html

---
Locations and their properties can be edited by enabling editing capabilities in the layer and `infoj` definitions.

## Edit locations

```text
"edit": {
  "point": true,
  "polygon": true,
  "rectangle": true,
  "circle": true,
  "line": true,
  "catchment": {...},
  "delete": true
}
```

Adding an edit object to the layer definition will add an edit panel to the layer's drawer. Depending on the entries of this layer object specific controls to draw new location geometries are added to the editing panel.

## Editing properties

`"edit": true`

By adding an edit key to an infoj entry the field becomes editable in the location's info panel.

```text
"edit": {
  "range": {
    "min": 0,
    "max": 30,
    "step": 1,
    "label": "Area Code: "
  }
}
```

Defining a range object as the edit value a range slider will be inserted into the info control.

```text
{
  "field": "status",
  "label": "Status:",
  "type": "text",
  "edit": {
    "options": [
      "Open",
      {
        "Closed": [
          "Permanent",
          "Temporarily"
        ]
      },
      {
        "Other": "text"
      }
    ]
  }
},
{
  "field": "status_det",
  "label": "Detailed Status: ",
  "type": "text",
  "edit": {
    "options_field": "open_closed"
  }
}
```

Options are displayed dropdown elements. An object with "text" as value allows the input of custom text for the options field.

Setting an options\_field in a subsequent entry to the entry with the options will display a dependent dropdown for this field.

e.g. Selecting 'Closed' in the first dropdown will populate the second dropdown with the options 'Permanent' and 'Temporarily'.

### Datepicker

Editable date fields will display a datepicker dialog. The date field in the database must be of the type `bigint` since dates are stored as [unix timestamps](https://www.unixtimestamp.com/).