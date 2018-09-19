const utils = require('./utils');

module.exports = function(){
    let layer = this;

    global._xyz.map.createPane("vector_test");
    global._xyz.map.getPane("vector_test").style.zIndex = 650;

    let drawnItems = L.featureGroup({
        pane: "vector_test"
    }).addTo(global._xyz.map);

    global._xyz.map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            }
        }
    }));

    global._xyz.map.on(L.Draw.Event.CREATED, function (event) {
        let _layer = event.layer;

        _layer.options.pane = "vector_test";
        console.log(_layer);

        drawnItems.addLayer(_layer);
    });
}