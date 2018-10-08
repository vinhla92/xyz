const utils = require('./utils');

module.exports = function(layer, panel){
    
    console.log(layer);

    let dom = {
        map: document.getElementById('Map')
    };

    let edits = utils._createElement({
        tag: "div",
        options: {
            classList: "section expandable"
        },
        appendTo: panel
    });

      // Edit control expander.
      utils._createElement({
        tag: 'div',
        options: {
            className: 'btn_text cursor noselect',
            textContent: 'Editing'
        },
        appendTo: edits,
        eventListener: {
            event: 'click',
            funct: e => {
                e.stopPropagation();
                utils.toggleExpanderParent({
                    expandable: edits,
                    accordeon: true,
                    scrolly: document.querySelector('.mod_container > .scrolly')
                })
            }
        }
    });

    // Begin make UI elements

    let block, draw;

    block = utils._createElement({
        tag: 'div',
        options: {
            className: 'block'
        },
        appendTo: edits
    });

    draw = utils._createElement({
        tag: 'div',
        appendTo: block,
        eventListener: {
            event: "click",
            funct: e => {
                e.stopPropagation();
                let control = global._xyz.map.getContainer().querySelector('.leaflet-draw.leaflet-control');
                if(control.classList.contains("visible")){
                    control.classList.remove("visible");
                    e.target.parentNode.classList.remove("activate");
                } else {
                    control.classList += " visible";
                    e.target.parentNode.classList += " activate";
                }
                //utils.addClass(control, "visible");
                //control.style.display = "block";
                console.log(global._xyz.map.getContainer());
                console.log(control);
            }
        }
    });

    utils._createElement({
        tag: 'i',
        options: {
            classList: 'material-icons cursor noselect left',
            textContent: "create",
            title: 'Draw'
        },
        appendTo: draw/*,
        eventListener: {
            event: "click",
            funct: e => {
                e.stopPropagation();
                let control = global._xyz.map.getContainer().querySelector('.leaflet-draw.leaflet-control');
                if(control.classList.contains("visible")){
                    control.classList.remove("visible");
                    e.target.classList.remove("activate");
                } else {
                    control.classList += " visible";
                    e.target.classList += " activate";
                }
                //utils.addClass(control, "visible");
                //control.style.display = "block";
                console.log(global._xyz.map.getContainer());
                console.log(control);
            }
        }*/
    });

    utils._createElement({
        tag: 'span',
        options: {
            classList: "title cursor noselect",
            textContent: 'Draw'
        },
        appendTo: draw
    });

    // Add descent edit control
    if(layer.editable && layer.editable === 'geometry'){
        block = utils._createElement({
            tag: 'div',
            options: {
                className: 'block'
            },
            appendTo: edits
        });
        
        draw = utils._createElement({
            tag: 'div',
            appendTo: block,
            eventListener: {
                event: "click",
                funct: e => {
                    e.stopPropagation();
                    
                    if(!layer.display) {
                        layer.display = true;
                        layer.clear_icon.textContent = layer.display ? 'layers' : 'layers_clear';
                        global._xyz.pushHook('layers', layer.layer);
                        layer.getLayer();
                    }
                    
                    let btn = e.target;
                    //utils.toggleClass(btn, 'active');
                    utils.toggleClass(btn, 'activate');
                    
                    layer.header.classList += ' edited';

                    //if (!utils.hasClass(btn, 'active')) {
                    if (!utils.hasClass(btn, 'activate')) {
                        layer.header.classList.remove('edited');
                        global._xyz.map.off('click');
                        dom.map.style.cursor = '';
                        return
                    }
                    
                    btn.style.textShadow = '2px 2px 2px #cf9;';
                    dom.map.style.cursor = 'crosshair';
                    
                    global._xyz.map.on('click', e => {
                        let marker = [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)];
                        //utils.removeClass(btn, 'active');
                        utils.removeClass(btn, 'activate');
                        global._xyz.map.off('click');
                        dom.map.style.cursor = '';
                        
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
                        
                        xhr.send(JSON.stringify({
                            locale: _xyz.locale,
                            layer: layer.layer,
                            table: layer.table,
                            geometry: {
                                type: 'Point',
                                coordinates: marker
                            }
                        }));
                    });
                    
                    document.addEventListener('keyup', e => {
                        e.stopPropagation();
                        if(e.keyCode === 27) {
                            layer.header.classList.remove('edited');
                            global._xyz.map.off('click');
                            dom.map.style.cursor = '';
                            return
                        } 
                    });
                }
            }
        });

        utils._createElement({
            tag: 'i',
            options: {
                textContent: 'add_location',
                classList: 'material-icons cursor noselect left'//,
                //title: 'Create new location'
            },
            appendTo: draw
        });

        utils._createElement({
            tag: 'span',
            options: {
                classList: "title cursor noselect",
                textContent: 'Create new location'
            },
            appendTo: draw
        });
    }




    // End make UI elements

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
        //console.log(e);
    });

    global._xyz.map.on(L.Draw.Event.EDITSTOP, e => {
        //console.log(e);
        drawnItems.clearLayers();
    });
}