import _xyz from '../../../_xyz.mjs';
import style from './style.mjs';
import { finish } from './_draw.mjs';

export default (e, layer) => {
    e.stopPropagation();
    
    if(!layer.display) layer.show();
    
    layer.header.classList.add('edited');
    _xyz.dom.map.style.cursor = 'crosshair';
    
    layer.edit.vertices = L.featureGroup().addTo(_xyz.map);
    layer.edit.trail = L.featureGroup().addTo(_xyz.map);
    layer.edit.path = L.featureGroup().addTo(_xyz.map);
    
    _xyz.map.on('click', e => {
        let start_pnt = [e.latlng.lat, e.latlng.lng];
        
        layer.edit.vertices.addLayer(L.circleMarker(e.latlng, style(layer).vertex));
        
        let len = layer.edit.vertices.getLayers().length;
            
        if(len === 1){
            _xyz.map.on('mousemove', e => {
                layer.edit.trail.clearLayers();
                layer.edit.trail.addLayer(L.rectangle([start_pnt, [e.latlng.lat, e.latlng.lng]], style(layer).path));
            });
        }
        
        if(len === 2){
            _xyz.map.off('mousemove');
            layer.edit.trail.clearLayers();
            _xyz.map.off('click');
            _xyz.dom.map.style.cursor = '';
            
            let rect = [];
            
            layer.edit.vertices.eachLayer(layer => {
                let latlng = layer.getLatLng();
                
                rect.push([latlng.lat, latlng.lng]);
            });
            
            layer.edit.path.addLayer(L.rectangle(rect, style(layer).path));
            
            // Make select tab active on mobile device.
            if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();
            
            let xhr = new XMLHttpRequest();
                xhr.open('POST', _xyz.host + '/api/location/new?token=' + _xyz.token);
                xhr.setRequestHeader('Content-Type', 'application/json');
                
                let _marker = layer.edit.path.getBounds().getCenter();
                let marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];
                
            xhr.onload = e => {
                if (e.target.status === 401) {
                    document.getElementById('timeout_mask').style.display = 'block';
                    //console.log(e.target.response);
                    return;
                }
                
                if (e.target.status === 200) {
                    layer.edit.vertices.clearLayers();
                    layer.edit.path.clearLayers();

                    layer.get();

                    finish(layer);
                    _xyz.state.finish();
                    _xyz.map.off('click');
                    
                    _xyz.locations.select({
                        layer: layer.key,
                        table: layer.table,
                        id: e.target.response,
                        marker: marker
                    });
                }
            }
            
            xhr.send(JSON.stringify({
                locale: _xyz.locale,
                layer: layer.key,
                table: layer.table,
                geometry: layer.edit.path.toGeoJSON().features[0].geometry
            }));
        }
    });
}