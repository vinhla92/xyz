**Fastify** is now version 2 release.

Fastify plugins have been upgraded to the latest versions.

fastify-auth 0.4.0

fastify-cors 2.1.2

fastify-formbody 3.1.0

fastify-helmet 3.0.0

fastify-jwt 0.9.3

fastify-static 2.3.4

Pino-pretty has been removed from dependencies.

**Update leaflet to version 1.4.0.**

**_xyz()** instantiation will load the first locale if no locale is specified as parameter.

**_xyz()** instantiation will async load the workspace if no callback is defined.

Async instantiation:
```
const xyz = await _xyz({
    host: document.head.dataset.dir
});
```

Instantiation with callback:
```
_xyz({
  host: document.head.dataset.dir
  callback: xyz => {}
})
```


**_xyz.workspace.loadLocale()** will load a locale from the workspace.

```
_xyz.workspace.loadLocale({
    locale: 'GB'
});
```

**_xyz.mapview.create()** will load a locale if the locale parameter is given as parameter.


**utils.paramstring()** will not add empty keys to output.

**utils.createCheckbox()** returns the input.

**utils.getCircularReplacer()** Replace circular reference when stringyfying JSON.

**utils.dataURLtoBlob()** Return Blob from dataURL.

**utils.turf.pointOnFeature()** Return [lat, lng] coordinate pair from a point in polygon. Will also work with point geometry.

**hooks.remove()** will empty but not remove array hooks.

select hooks are retired. 

locations are now stored in **hooks.current.locations[]**.

The location hook will be removed if a location cannot be selected.

**hooks.set()** uses now Object.assign instead of a single key/value pair.

The **_xyz.hooks** object is structured as follows:

```
hooks : {
    current : {
        layers : [],
        locations : []
    },
    filter : ()=>{},
    push : ()=>{},
    remove : ()=>{},
    removeAll : ()=>{},
    set : ()=>{},
}
```

**mapview.draw.geoJSON({})**

Drawing GeoJSON to the map is now a drawing method on the mapview.

**mapview.popup()**

Will open a popup on the mapview. Content and latlng must be supplied as input param.


**Locations**

**_xyz.locations** has a **select()** method as well as location prototype object.

Calling **_xyz.locations.select()** with input parameters will create a location and get it's data from the XYZ middleware.

Without a mapview and no callback the select method will create an alert with the stringified infoj object.

With a mapview the location will be drawn to the map and a popup with the location view will be displayed.

A callback can be passed to the select method to control the display of the location view.

```
_xyz.locations.select(
  //params
  {
    locale: 'NE',
    dbs: 'XYZ',
    layer: 'COUNTRIES',
    table: 'dev.natural_earth_countries',
    id: 80,
  },
  //callback
  location=>{
    location.style.fillColor = '#f44336';
    location.style.fillOpacity = 1;
    location.draw();
    document.getElementById('location_info_container2').appendChild(location.view.node);
  }
);
```

**Groups** setting `expanded: true` in the group will have the group automatically expanded when the location view is added.

**location.draw()** will draw the location to the mapview.

**location.flyTo()** will create a featuregroup of all of the locations geometries and fly the map to the extent of the featuregroup.

**location.update()** will update the location in the database. A post request with the newValues will be sent to the api/location/update endpoint. The update method accepts a callback to be fired after the location view has been updated.


A location's own methods know their parent.

location.draw(), location.remove(), etc. do not need the location object as input parameter. 



```
locations : {
    select : {},
    location : {
        infoj : [],
        update: ()={},
        flyTo: ()=>{},
        geometry : {},
        Geometry : {},
        marker : {},
        Marker : {},
        geometries : [],
        remove : ()=>{},
        get : ()=>{},
        draw : ()=>{},
        view : {
            update : {},
            node : {},
            geometry : {
                ctrl : {
                    isoline_here : ()=>{},
                    isoline_mapbox : ()=>{},
                    delete_geom : ()=>{},
                    show_geom : ()=>{},
                    hide_geom : ()=>{},
                }
            },
            group : {},
            groups : {},
            streetview : ()=>{},
            images : {
                ctrl : {
                    add_image : ()=>{},
                    delete_image : ()=>{},
                    upload_image : ()=>{},
                },
            }
        }
    }
}
```

**Isolines**

Isoline endpoints are:

/api/location/edit/isoline/here

/api/location/edit/isoline/mapbox

The isoline will be added to an existing location if provided with an ID and field; The infoj of the updated location will be returned.

Otherwise a new location will created in the specified layer and the location ID will be returned.

The defaults for the *isoline_mapbox* object are:

```
isoline_mapbox = {
    profile : 'driving',
    minutes : 10,
    coordinates : [lng, lat]
}
```

The defaults for the *isoline_here* object are:

```
isoline_here = {
    mode : 'car',
    type : 'fastest',
    rangetype : 'time', // or 'distance'
    minutes : 10,
    distance : 10, //km, will only be used if rangetype is 'distance'
    coordinates : [lat, lng]
}
```