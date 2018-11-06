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

    let coords = [];

    _xyz.map.on('click', e => {
        let start_pnt = [e.latlng.lat, e.latlng.lng];
        layer.edit.vertices.addLayer(L.circleMarker(e.latlng, style(layer).vertex));
        let len = layer.edit.vertices.getLayers().length, part = [];
        
        if(len > 1){
            part = [
                [layer.edit.vertices.getLayers()[len-2].getLatLng().lat, layer.edit.vertices.getLayers()[len-2].getLatLng().lng],
                [layer.edit.vertices.getLayers()[len-1].getLatLng().lat, layer.edit.vertices.getLayers()[len-1].getLatLng().lng]
            ];
            layer.edit.path.addLayer(L.polyline([part], style(layer).path));
        }
        
        _xyz.map.on('mousemove', e => {
            layer.edit.trail.clearLayers();
            layer.edit.trail.addLayer(L.polyline([start_pnt, [e.latlng.lat, e.latlng.lng]], style(layer).trail));
        });
        
        _xyz.map.on('contextmenu', e => {
            _xyz.map.off('mousemove');
            _xyz.map.off('contextmenu');
            _xyz.map.off('click');
            _xyz.dom.map.style.cursor = '';
                
            coords = [];

            layer.edit.path.eachLayer(layer => {
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
            if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();

            let xhr = new XMLHttpRequest();
            xhr.open('POST', _xyz.host + '/api/location/new?token=' + _xyz.token);
            xhr.setRequestHeader('Content-Type', 'application/json');

            let _marker = layer.edit.vertices.getLayers()[Math.ceil(len/2)].getLatLng(),
                marker = [_marker.lng, _marker.lat];
                
            xhr.onload = e => {
                if (e.target.status === 401) {
                    document.getElementById('timeout_mask').style.display = 'block';
                    //console.log(e.target.response);
                    return;
                }
                    
                if (e.target.status === 200) {
                    finish(layer);
                    _xyz.state.finish();
                    _xyz.map.off('click');
                    
                    layer.get();

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
                geometry: multiline
            }));
        });
    });
}