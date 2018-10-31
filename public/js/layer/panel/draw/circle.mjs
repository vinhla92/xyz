import _xyz from '../../../_xyz.mjs';
import style from './style.mjs';

import circle from '@turf/circle';
import distance from '@turf/distance';
import helpers from '@turf/helpers';

export default (e, layer) => {
    e.stopPropagation();

    _xyz.resetEditSession(layer);

    layer.edited = layer.edited ? false : true;

    let btn = e.target;

    if(layer.edited && !layer.display){
        layer.display = true;
        layer.toggle.textContent = layer.display ? 'layers' : 'layers_clear';
        _xyz.hooks.push('layers', layer.key);
        layer.get();
    }

    if(!layer.edited){
        layer.header.classList.remove('edited');
    } else {
        layer.header.classList.add('edited');
        _xyz.dom.map.style.cursor = 'crosshair';

        layer.edit.vertices = L.featureGroup().addTo(_xyz.map);
        layer.edit.trail = L.featureGroup().addTo(_xyz.map);
        layer.edit.path = L.featureGroup().addTo(_xyz.map);

        _xyz.map.on('click', e => {

            layer.edit.vertices.addLayer(L.circleMarker(e.latlng, style(layer).vertex));

            if(_xyz.state != btn) return;

            let len = layer.edit.vertices.getLayers().length, 
                o, c, s, r, // origin, cursor, segment, radius
                options = {units: "metres", steps: 128}; // circle options

            o = helpers.point([layer.edit.vertices.getLayers()[0].getLatLng().lng, layer.edit.vertices.getLayers()[0].getLatLng().lat]);

            if(len === 1){
                _xyz.map.on('mousemove', e => {
                    layer.edit.trail.clearLayers();
                    c = helpers.point([e.latlng.lng, e.latlng.lat]);
                    r = distance(o, c, options).toFixed(2);
                    
                    layer.edit.trail.addLayer(L.circle([layer.edit.vertices.getLayers()[0].getLatLng().lat, layer.edit.vertices.getLayers()[0].getLatLng().lng], Object.assign(style(layer).path, {radius: parseFloat(r)})));
                });
            }

            if(len === 2){
                layer.edit.trail.clearLayers();
                s = helpers.point([layer.edit.vertices.getLayers()[len-1].getLatLng().lng, layer.edit.vertices.getLayers()[len-1].getLatLng().lat]);
                r = distance(o, s, options).toFixed(2);
                layer.edit.trail.clearLayers();
                _xyz.dom.map.style.cursor = '';
                _xyz.map.off('mousemove');
                _xyz.map.off('click');

                layer.edit.path.addLayer(L.circle([layer.edit.vertices.getLayers()[0].getLatLng().lat, layer.edit.vertices.getLayers()[0].getLatLng().lng], Object.assign(style(layer).path, {radius: parseFloat(r)})));

                // Make select tab active on mobile device.
                if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();

                let xhr = new XMLHttpRequest();
                xhr.open('POST', _xyz.host + '/api/location/new?token=' + _xyz.token);
                xhr.setRequestHeader('Content-Type', 'application/json');

                xhr.onload = e => {
                    if (e.target.status === 401) {
                        document.getElementById('timeout_mask').style.display = 'block';
                        //console.log(e.target.response);
                        return
                    }

                    if (e.target.status === 200) {
                        layer.edit.vertices.clearLayers();
                        layer.edit.path.clearLayers();
                        
                        layer.get();

                        _xyz.switchState(layer, btn); // jumps back to select state;
                        _xyz.resetEditSession(layer);
                        
                        _xyz.locations.select({
                            layer: layer.key,
                            table: layer.table,
                            id: e.target.response,
                            marker: o.geometry.coordinates,
                            editable: layer.edit ? layer.edit.properties : false
                        });
                    }
                }

                xhr.send(JSON.stringify({
                    locale: _xyz.locale,
                    layer: layer.key,
                    table: layer.table,
                    geometry: circle(o, r, options).geometry
                }));
            }
        });
    }
}