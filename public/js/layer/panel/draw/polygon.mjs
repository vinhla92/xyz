import _xyz from '../../../_xyz.mjs';
import style from './style.mjs';
//import { booleanValid } from '@turf/boolean-valid';

export function polygon (layer) {

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

  });

}