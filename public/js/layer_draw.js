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
        console.log(_layer);

        drawnItems.addLayer(_layer);
    });
}