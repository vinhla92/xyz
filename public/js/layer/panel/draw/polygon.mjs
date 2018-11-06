import _xyz from '../../../_xyz.mjs';
import style from './style.mjs';
import { finish } from './_draw.mjs';
//import { booleanValid } from '@turf/boolean-valid';

export function polygon (e, layer) {

  e.stopPropagation();

  if(!layer.display) layer.show();

  let coords = [];

  layer.header.classList.add('edited');

  _xyz.dom.map.style.cursor = 'crosshair';

  layer.edit.vertices = L.featureGroup().addTo(_xyz.map);
  layer.edit.trail = L.featureGroup().addTo(_xyz.map);
  layer.edit.path = L.featureGroup().addTo(_xyz.map);

  _xyz.map.on('click', e => {

    layer.edit.vertices.addLayer(L.circleMarker(e.latlng, style(layer).vertex));
            
    let
      len = layer.edit.vertices.getLayers().length,
      segment = [];
            
    if(len === 2) {
      segment = [
        [layer.edit.vertices.getLayers()[len-2].getLatLng().lat, layer.edit.vertices.getLayers()[len-2].getLatLng().lng],
        [layer.edit.vertices.getLayers()[len-1].getLatLng().lat, layer.edit.vertices.getLayers()[len-1].getLatLng().lng]
      ];
      layer.edit.path.addLayer(L.polyline([segment], style(layer).path));
    }
            
    if(len > 2) {
      layer.edit.path.clearLayers();
      coords = [];
      segment = [];

      layer.edit.vertices.eachLayer(layer => {
        let latlng = [layer.getLatLng().lng, layer.getLatLng().lat];
        coords.push(latlng);
        segment.push(latlng.reverse());
      });

      layer.edit.path.addLayer(L.polygon(coords, style(layer).path));
    }
            
    _xyz.map.on('mousemove', e => {
      layer.edit.trail.clearLayers();
                
      layer.edit.trail.addLayer(L.polyline([
        [layer.edit.vertices.getLayers()[0].getLatLng().lat, layer.edit.vertices.getLayers()[0].getLatLng().lng],
        [e.latlng.lat,e.latlng.lng], 
        [layer.edit.vertices.getLayers()[len-1].getLatLng().lat, layer.edit.vertices.getLayers()[len-1].getLatLng().lng]
      ], style(layer).path));

    });

    _xyz.map.on('contextmenu', e => {
                
      _xyz.map.off('mousemove');
      _xyz.map.off('contextmenu');
      _xyz.map.off('click');
      _xyz.dom.map.style.cursor = '';

      layer.edit.trail.clearLayers();
      
      coords = [];
      layer.edit.vertices.eachLayer(layer => {
          coords.push([layer.getLatLng().lng, layer.getLatLng().lat]);
      });
      coords.push(coords[0]);
      
      let poly = {
          "type": "Polygon",
          "coordinates": [coords],
          "properties": {}
      };
      
      // Make select tab active on mobile device.
      if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();
      
      let xhr = new XMLHttpRequest();
      xhr.open('POST', _xyz.host + '/api/location/new?token=' + _xyz.token);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      let _marker = layer.edit.vertices.getBounds().getCenter(),
          marker = [_marker.lng.toFixed(5), _marker.lat.toFixed(5)];
          
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
          geometry: poly
      }));
    }); 

  });

}