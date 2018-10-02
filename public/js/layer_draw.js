const utils = require('./utils');

module.exports = function(layer, panel){
    
    console.log(layer);

    let drawnItems = L.featureGroup().addTo(global._xyz.map);

    let shapeOptions = Object.assign(layer.style.default, {
        pane: layer.pane[0]
    });

    let drawOptions = {
        allowIntersection: false,
        showArea: false,
        shapeOptions: shapeOptions,
        guidelineDistance: 15,
        repeatMode: false
    };

    global._xyz.map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: drawOptions,
            //polyline: drawOptions,
            polyline: false,
            circle: false,
            marker: false,
            rectangle: drawOptions,
            circlemarker: false
        }
    }));

    global._xyz.map.on(L.Draw.Event.CREATED, function (event) {
        let _layer = event.layer;

        drawnItems.addLayer(_layer);
    });
    
    /*global._xyz.map.on(L.Draw.Event.EDITSTOP, e => {
        console.log('this is a feature to post and save');

        // Make select tab active on mobile device.
        if (global._xyz.activateLocationsTab) global._xyz.activateLocationsTab();

        let _marker = drawnItems.getBounds().getCenter();
        let marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];

        let featureCollection = drawnItems.toGeoJSON();

        let coords = [];

        featureCollection.features.map(item => {
            coords.push(item.geometry.coordinates);
        });

        let multiPoly = {
            "type": "Multipolygon",
            "coordinates": coords
        };

        //console.log(_xyz.locale);

            //console.log(_xyz.locale);
            fetch(global._xyz.host + '/api/location/new?token=' + global._xyz.token, {
                method: "POST",
                body: JSON.stringify({
                    locale: _xyz.locale,
                    layer: layer.layer,
                    table: layer.table,
                    geometry: multiPoly
                })
            }).then((res) => {
                console.log(res.json());
                return res.json();
            }).then((data) => {
                console.log(data);
            })
    });*/


    global._xyz.map.on(L.Draw.Event.EDITSTOP, e => {
        console.log('this is a feature to post and save');

        // Make select tab active on mobile device.
        if (global._xyz.activateLocationsTab) global._xyz.activateLocationsTab();

        let xhr = new XMLHttpRequest();
        
        xhr.open('POST', global._xyz.host + '/api/location/new?token=' + global._xyz.token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = e => {
            if (e.target.status === 401) {
                document.getElementById('timeout_mask').style.display = 'block';
                console.log(e.target.response);
                return
            }

            if (e.target.status === 200) {
                layer.getLayer();
                global._xyz.select.selectLayerFromEndpoint({
                    layer: layer.layer,
                    table: layer.table,
                    id: e.target.response,
                    marker: marker,
                    editable: true
                });
            }

        }

        let _marker = drawnItems.getBounds().getCenter();
        let marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];

        let featureCollection = drawnItems.toGeoJSON();

        let coords = [];

        featureCollection.features.map(item => {
            coords.push(item.geometry.coordinates);
        });

        let multiPoly = {
            "type": "Multipolygon",
            "coordinates": coords,
            "properties": {}
        };

        console.log(multiPoly);
        
        xhr.send(JSON.stringify({
            locale: _xyz.locale,
            layer: layer.layer,
            table: layer.table,
            geometry: multiPoly
        }));

        /*console.log(JSON.stringify({
            locale: _xyz.locale,
            layer: layer.layer,
            table: layer.table,
            geometry: multiPoly
        }));*/

    });

    global._xyz.map.on(L.Draw.Event.TOOLBAROPENED, e => {
        console.log(e);
    });
}