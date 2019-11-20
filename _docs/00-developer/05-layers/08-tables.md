---
title: Tables
subtitle: Tables for layers
tag: developer
tags: [developer]
layout: root.html
---

Layer data can be displayed in tables. Tables are defined inside `layer.tableview: {}` object:

```text
"tableview": {
	"tables": {
	    "Retail Places": {
	    	"from": "dev.retailplaces", // data source
	    	"columns": [
	    	{
	    		"title": "ID",
	    		"field": "id"
	    	},{
	    		"field": "dev_date",
	    		"title": "Date",
	    		"type": "date"
	    	},{
	    		"field": "rp_type"
	    	}
	    	]
	    },
	    ...
	}
}
```

![Layer tables.](../tableview_tables_1.png)

On row click feature is selected in the location view:

![Feature selected from layer tables.](../tableview_tables_2.png)
