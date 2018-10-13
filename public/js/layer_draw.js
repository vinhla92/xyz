const utils = require('./utils');
const svg_symbols = require('./svg_symbols');

module.exports = function(layer, panel){

    let dom = {
        map: document.getElementById('Map')
    };

    let vertex_style = {
        pane: layer.pane[0],
        stroke: true,
        color: "darkgrey",
        fillColor: "steelblue",
        weight: 1,
        radius: 5
    };

    let tmp_trail_style = {
        pane: layer.pane[0],
        stroke: true,
        color: '#666',
        dashArray: "5 5",
        weight: 1
    };

    let trail_style = {
        pane: layer.pane[0],
        stroke: true,
        color: '#666',
        dashArray: "5 5",
        fill: true,
        fillColor: "#cf9",
        weight: 1
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

    let block;

    if(layer.format === 'geojson' && layer.editable === 'geometry'){
        
        block = utils._createElement({
            tag: 'div',
            options: {
                className: 'block'
            },
            appendTo: edits
        });

        // -- Begin Polygon
        let polygon_draw = utils._createElement({
            tag: 'div',
            appendTo: block,
            eventListener: {
                event: "click",
                funct: e => {
                    e.stopPropagation();

                    layer.edited = layer.edited ? false : true;

                    if(layer.edited && !layer.display){
                        layer.display = true;
                        layer.clear_icon.textContent = layer.display ? 'layers' : 'layers_clear';
                        global._xyz.pushHook('layers', layer.layer);
                        layer.getLayer();
                    }

                    if(!layer.edited){
                        utils.removeClass(e.target, "activate");
                        utils.removeClass(layer.header, "edited");
                    } else {
                        let btn = e.target;
                        //btn.classList += " activate";
                        utils.addClass(btn, 'activate');
                        //layer.header.classList += ' edited';
                        utils.addClass(layer.header, 'edited');

                        dom.map.style.cursor = 'crosshair';

                        let drawnItems = L.featureGroup().addTo(global._xyz.map);
                        let coords = [];
                        let trail = L.featureGroup().addTo(global._xyz.map);
                        let tmp_trail = L.featureGroup().addTo(global._xyz.map);

                        let start_pnt;
                        global._xyz.map.on('click', e => {
                            start_pnt = [global._xyz.map.mouseEventToLatLng(e.originalEvent).lat, global._xyz.map.mouseEventToLatLng(e.originalEvent).lng];
                            
                            drawnItems.addLayer(L.circleMarker(global._xyz.map.mouseEventToLatLng(e.originalEvent), vertex_style));

                            let len = drawnItems.getLayers().length, part = [];

                            console.log(len);

                            if(len === 2) {
                                console.log('draw line');
                                let pts = drawnItems.toGeoJSON();
                                part = [pts.features[len-2].geometry.coordinates.reverse(), pts.features[len-1].geometry.coordinates.reverse()];

                                trail.addLayer(L.polyline([part], trail_style));
                            }

                            if(len > 2){
                                trail.clearLayers();
                                coords = [];
                                part = [];
                                let pts = drawnItems.toGeoJSON();
                                pts.features.map(item => {
                                    coords.push(item.geometry.coordinates);
                                    part.push(item.geometry.coordinates.reverse())
                                });
                                trail.addLayer(L.polygon(coords, trail_style));
                            }
                            
                            global._xyz.map.on('mousemove', e => {
                                tmp_trail.clearLayers();
                                
                                tmp_trail.addLayer(L.polyline([
                                    [drawnItems.getLayers()[0].getLatLng().lat, drawnItems.getLayers()[0].getLatLng().lng],
                                    [global._xyz.map.mouseEventToLatLng(e.originalEvent).lat, global._xyz.map.mouseEventToLatLng(e.originalEvent).lng], 
                                    [drawnItems.getLayers()[len-1].getLatLng().lat, drawnItems.getLayers()[len-1].getLatLng().lng]
                                ], tmp_trail_style));
                            });

                            global._xyz.map.on('contextmenu', e => {
                                global._xyz.map.off('mousemove');
                                tmp_trail.clearLayers();
                                global._xyz.map.off('contextmenu');
                                global._xyz.map.off('click');

                                dom.map.style.cursor = '';
                                utils.removeClass(btn, 'activate');
                                //utils.removeClass(layer.header, 'edited');
                                
                                layer.edited = false;

                                //let shape = [];
                                coords = [];
                                drawnItems.eachLayer(layer => {
                                    coords.push([layer.getLatLng().lng, layer.getLatLng().lat]);
                                });

                                coords.push(coords[0]);

                                let poly = {
                                    "type": "Polygon",
                                    "coordinates": [coords],
                                    "properties": {}
                                };

                                //console.log(JSON.stringify(poly));
                                
                                // Make select tab active on mobile device.
                                if (global._xyz.activateLocationsTab) global._xyz.activateLocationsTab();

                                let xhr = new XMLHttpRequest();
                                xhr.open('POST', global._xyz.host + '/api/location/new?token=' + global._xyz.token);
                                xhr.setRequestHeader('Content-Type', 'application/json');

                                let _marker = drawnItems.getBounds().getCenter();
                                let marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];

                                xhr.onload = e => {

                                    if (e.target.status === 401) {
                                        document.getElementById('timeout_mask').style.display = 'block';
                                        console.log(e.target.response);
                                        return
                                    }
                                    
                                    if (e.target.status === 200) {

                                        drawnItems.clearLayers();
                                        trail.clearLayers();
                                        layer.edited = false;
                                        //utils.removeClass(layer.header, 'edited'); // this should happen where final save
                                        //utils.removeClass(btn.parentNode, 'activate');

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
                                    geometry: poly
                                }));



                            });
                        });
                    }
                }
            }
        });

        utils._createElement({
            tag: 'i',
            options: {
                classList: 'material-icons cursor noselect left',
                textContent: 'change_history',
                title: "Draw a polygon"
            },
            appendTo: polygon_draw
        });

        utils._createElement({
            tag: 'span',
            options: {
                classList: "title cursor noselect",
                textContent: "Polygon"
            },
            appendTo: polygon_draw
        });

        // -- End Polygon

        // -- Begin rectangle draw
        let rect_draw = utils._createElement({
            tag: 'div',
            appendTo: 'block',
            eventListener: {
                event: 'click',
                funct: e => {
                    e.stopPropagation();
                    layer.edited = layer.edited ? false : true;
                    
                    if(layer.edited && !layer.display){
                        layer.display = true;
                        layer.clear_icon.textContent = layer.display ? 'layers' : 'layers_clear';
                        global._xyz.pushHook('layers', layer.layer);
                        layer.getLayer();
                    }

                    if(!layer.edited){
                        utils.removeClass(e.target.parentNode, "activate");
                        utils.removeClass(layer.header, "edited");
                    } else {
                        let btn = e.target;
                        //btn.parentNode.classList += " activate";
                        utils.addClass(btn, "activate");
                        utils.addClass(layer.headerm, "edited");
                        //layer.header.classList += ' edited';

                        dom.map.style.cursor = 'crosshair';

                        let drawnItems = L.featureGroup().addTo(global._xyz.map);
                        let coords = [];
                        let trail = L.featureGroup().addTo(global._xyz.map);
                        let tmp_trail = L.featureGroup().addTo(global._xyz.map);

                        let start_pnt;
                        global._xyz.map.on('click', e => {
                            start_pnt = [global._xyz.map.mouseEventToLatLng(e.originalEvent).lat, global._xyz.map.mouseEventToLatLng(e.originalEvent).lng];


                            drawnItems.addLayer(L.circleMarker(global._xyz.map.mouseEventToLatLng(e.originalEvent), vertex_style));

                            let len = drawnItems.getLayers().length;

                            /*function editend(e){
                                console.log('editend');
                                console.log(trail.getLayers().length);
                                tmp_trail.clearLayers();
                                trail.clearLayers();
                                drawnItems.clearLayers();
                                dom.map.style.cursor = '';
                                utils.removeClass(btn.parentNode, 'activate');
                                utils.removeClass(layer.header, 'edited');
                                layer.edited = false;
                                global._xyz.map.off('contextmenu');
                            }*/
                            if(len === 1){

                                global._xyz.map.on('mousemove', e => {
                                    tmp_trail.clearLayers();
                                    tmp_trail.addLayer(L.rectangle([start_pnt, [global._xyz.map.mouseEventToLatLng(e.originalEvent).lat, global._xyz.map.mouseEventToLatLng(e.originalEvent).lng]], tmp_trail_style));
                                });

                            /*global._xyz.map.once('contextmenu', e => {
                                global._xyz.map.off('mousemove');
                                tmp_trail.clearLayers();
                                trail.clearLayers();
                                drawnItems.clearLayers();
                                dom.map.style.cursor = '';
                                utils.removeClass(btn.parentNode, 'activate');
                                utils.removeClass(layer.header, 'edited');
                                layer.edited = false;
                                console.log(tmp_trail.getLayers());
                                console.log(trail.getLayers());
                                console.log(drawnItems.getLayers());
                            });*/
                            //global._xyz.map.off('contextmenu');
                        }
                            /*document.addEventListener('keyup', e => {
                                if(e.keyCode === 27) global._xyz.map.off('mousemove'), editend(e)
                            });*/

                            //console.log(len);

                            if(len === 2) {
                                global._xyz.map.off('mousemove');
                                tmp_trail.clearLayers();
                                global._xyz.map.off('click');

                                dom.map.style.cursor = '';
                                utils.removeClass(btn, 'activate');

                                layer.edited = false;

                                let rect = [];
                                drawnItems.eachLayer(layer => {
                                    let latlng = layer.getLatLng();
                                    //console.log(layer.getLatLng());
                                    rect.push([latlng.lat, latlng.lng]);
                                });

                                console.log(rect);

                                trail.addLayer(L.rectangle(rect, trail_style));

                                console.log(JSON.stringify(trail.toGeoJSON()));

                                // Make select tab active on mobile device.
                                if (global._xyz.activateLocationsTab) global._xyz.activateLocationsTab();

                                let xhr = new XMLHttpRequest();
                                xhr.open('POST', global._xyz.host + '/api/location/new?token=' + global._xyz.token);
                                xhr.setRequestHeader('Content-Type', 'application/json');
                                
                                let _marker = trail.getBounds().getCenter();
                                let marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];

                                xhr.onload = e => {

                                    if (e.target.status === 401) {
                                        document.getElementById('timeout_mask').style.display = 'block';
                                        console.log(e.target.response);
                                        return
                                    }
                                    
                                    if (e.target.status === 200) {

                                        drawnItems.clearLayers();
                                        trail.clearLayers();
                                        layer.edited = false;

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
                                    geometry: trail.toGeoJSON().features[0].geometry
                                }));
                            }
                            
                        });
                    }
                }
            },
            appendTo: block
        });
        
        utils._createElement({
            tag: 'i',
            options: {
                classList: 'material-icons cursor noselect left',
                textContent: 'crop_din',
                title: "Draw a rectangle"
            },
            appendTo: rect_draw
        });

        utils._createElement({
            tag: 'span',
            options: {
                classList: "title cursor noselect",
                textContent: "Rectangle"
            },
            appendTo: rect_draw
        });

        // -- End rectangle draw

        // -- Begin circle draw

        let circle_draw = utils._createElement({
            tag: 'div',
            appendTo: 'block',
            eventListener: {

            },
            appendTo: block
        });
        
        utils._createElement({
            tag: 'i',
            options: {
                classList: 'material-icons cursor noselect left',
                textContent: 'panorama_fish_eye',
                title: "Draw a circle"
            },
            appendTo: circle_draw
        });

        utils._createElement({
            tag: 'span',
            options: {
                classList: "title cursor noselect",
                textContent: "Circle"
            },
            appendTo: circle_draw
        });

        // -- End circle draw

    }

    // Begin Polyline
    if(layer.format === 'geojson' && layer.editable === 'polyline'){

        block = utils._createElement({
            tag: 'div',
            options: {
                className: 'block'
            },
            appendTo: edits
        });

        let polyline_draw = utils._createElement({
            tag: 'div',
            appendTo: block,
            eventListener: {
                event: "click",
                funct: e => {
                    e.stopPropagation();
                    
                    layer.edited = layer.edited ? false : true;
                    
                    if(layer.edited && !layer.display) {
                        layer.display = true;
                        layer.clear_icon.textContent = layer.display ? 'layers' : 'layers_clear';
                        global._xyz.pushHook('layers', layer.layer);
                        layer.getLayer();
                    }
                    
                    if(!layer.edited){            
                        utils.removeClass(e.target.parentNode, "activate");
                        utils.removeClass(layer.header, "edited");
                    } else {
                        let btn = e.target;
                        //btn.parentNode.classList += " activate";
                        utils.addClass(btn, 'activate');
                        utils.addClass(layer.header, 'edited');
                        //layer.header.classList += ' edited';

                        dom.map.style.cursor = 'crosshair';

                        let drawnItems = L.featureGroup().addTo(global._xyz.map);
                        let featureCollection = drawnItems.toGeoJSON();
                        let coords = [];
                        let trail = L.featureGroup().addTo(global._xyz.map);
                        let tmp_trail = L.featureGroup().addTo(global._xyz.map);

                        global._xyz.map.on('click', e => {
                            
                            let start_pnt = [global._xyz.map.mouseEventToLatLng(e.originalEvent).lat, global._xyz.map.mouseEventToLatLng(e.originalEvent).lng];
                            
                            drawnItems.addLayer(L.circleMarker(global._xyz.map.mouseEventToLatLng(e.originalEvent), vertex_style));

                            let len = drawnItems.getLayers().length, part = [];
                            

                            if(len > 1){
                                console.log('add line');

                                let pts = drawnItems.toGeoJSON();
                                part = [
                                    [drawnItems.getLayers()[len-2].getLatLng().lat, drawnItems.getLayers()[len-2].getLatLng().lng],
                                    [drawnItems.getLayers()[len-1].getLatLng().lat, drawnItems.getLayers()[len-1].getLatLng().lng]
                                ];
                                
                                trail.addLayer(L.polyline([part], trail_style));
                            }

                            global._xyz.map.on('mousemove', e => {
                                tmp_trail.clearLayers();
                                
                                tmp_trail.addLayer(L.polyline([start_pnt, [global._xyz.map.mouseEventToLatLng(e.originalEvent).lat, global._xyz.map.mouseEventToLatLng(e.originalEvent).lng]], tmp_trail_style));
                            });

                            global._xyz.map.on('contextmenu', e => {

                                global._xyz.map.off('mousemove');
                                
                                tmp_trail.clearLayers();
                                
                                global._xyz.map.off('contextmenu');
                                global._xyz.map.off('contextmenu');
                                global._xyz.map.off('click');
                                
                                dom.map.style.cursor = '';
                                utils.removeClass(btn, 'activate');

                                layer.edited = false;

                                coords = [];
                                
                                trail.eachLayer(layer => {
                                    let latlngs = layer.getLatLngs();
                                    if(latlngs) latlngs.map(latlng => {
                                        let coord = [];
                                        latlng.map(l => coord.push([l.lng, l.lat]));
                                        
                                        coords.push(coord);
                                    });
                                });

                                let multiline = {
                                    "type": "MultiLineString",
                                    "coordinates": coords,
                                    "properties": {}
                                };

                                // Make select tab active on mobile device.
                                if (global._xyz.activateLocationsTab) global._xyz.activateLocationsTab();

                                let xhr = new XMLHttpRequest();
                                xhr.open('POST', global._xyz.host + '/api/location/new?token=' + global._xyz.token);
                                xhr.setRequestHeader('Content-Type', 'application/json');

                                let _marker = drawnItems.getLayers()[Math.ceil(len/2)].getLatLng();
                                let marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];

                                xhr.onload = e => {

                                    if (e.target.status === 401) {
                                        document.getElementById('timeout_mask').style.display = 'block';
                                        console.log(e.target.response);
                                        return
                                    }
                                    
                                    if (e.target.status === 200) {

                                        drawnItems.clearLayers();
                                        trail.clearLayers();
                                        layer.edited = false;
                                        //utils.removeClass(layer.header, 'edited'); // this should happen where final save
                                        //utils.removeClass(btn.parentNode, 'activate');

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
                                    geometry: multiline
                                }));
                                

                            });
                        });  

                        //}
                            /*document.addEventListener('keyup', e => { // ESC support
                                e.stopPropagation();
                                if(e.keyCode === 27) {
                                    //layer.header.classList.remove('edited');
                                    utils.removeClass(layer.header, 'edited');
                                    //btn.parentNode.classList.remove('activate');
                                    utils.removeClass(btn.parentNode, 'activate');
                                    //global._xyz.map.off('click');
                                    dom.map.style.cursor = '';
                                    layer.edited = false;
                                    //return
                                }
                            });*/
                            //return false;
                      
                    }
                }
            }
        });
        
        utils._createElement({
            tag: 'i',
            options: {
                classList: 'material-icons cursor noselect left',
                textContent: "create",
                title: 'Draw a polyline'
            },
            appendTo: polyline_draw
        });
        
        utils._createElement({
            tag: 'span',
            options: {
                classList: "title cursor noselect",
                textContent: 'Polyline'
            },
            appendTo: polyline_draw
        });
    }
     // ---- End Polyline

    // Add cluster edit control
    if(layer.format === "cluster" && layer.editable === 'geometry'){
        
        block = utils._createElement({
            tag: 'div',
            options: {
                className: 'block'
            },
            appendTo: edits
        });
        
        let draw = utils._createElement({
            tag: 'div',
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
                
                    utils.addClass(layer.header, 'edited');

                    //if (!utils.hasClass(btn, 'active')) {
                    if (!utils.hasClass(btn, 'activate')) {
                        utils.removeClass(layer.header, 'edited');
                        global._xyz.map.off('click');
                        dom.map.style.cursor = '';
                        return
                    }
                    
                    btn.style.textShadow = '2px 2px 2px #cf9;';
                    dom.map.style.cursor = 'crosshair';
                    
                    global._xyz.map.on('click', e => {
                        let marker = [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)];

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
                            
                            utils.removeClass(layer.header, 'edited');
                            utils.removeClass(btn, 'activate');
                            global._xyz.map.off('click');
                            dom.map.style.cursor = '';
                            return
                        } 
                    });
                }
            },
            appendTo: block
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
    // End cluster edit control
}