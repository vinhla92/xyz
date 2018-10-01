const utils = require('./utils');

module.exports = function(layer, panel){
    
    //let layer = this;
    //console.log('draw');
    console.log(layer);
    //console.log(panel);

    /*global._xyz.map.createPane("vector_test");
    global._xyz.map.getPane("vector_test").style.zIndex = 650;*/

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
            polyline: drawOptions,
            circle: false,
            marker: false,
            rectangle: drawOptions,
            circlemarker: false
        }
    }));

    global._xyz.map.on(L.Draw.Event.CREATED, function (event) {
        let _layer = event.layer;

        //_layer.options.pane = "vector_test";
        //_layer.options = layer.style.default;
        //console.log(_layer);

        drawnItems.addLayer(_layer);
        //console.log(drawnItems);
        //console.log(drawnItems.toGeoJSON());
    });

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
                /*layer.getLayer();
                global._xyz.select.selectLayerFromEndpoint({
                    layer: layer.layer,
                    table: layer.table,
                    id: e.target.response,
                    marker: marker,
                    editable: true
                });*/
            }

        }
        
        /*xhr.send(JSON.stringify({
            locale: _xyz.locale,
            layer: layer.layer,
            table: layer.table,
            geometry: {
                type: 'Point',
                coordinates: marker
            }
        }));*/

        console.log(JSON.stringify({
            locale: _xyz.locale,
            layer: layer.layer,
            table: layer.table,
            geometry: drawnItems.toGeoJSON()
        }));
        
    });
}