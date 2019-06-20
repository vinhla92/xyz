import L from 'leaflet';

import 'leaflet.vectorgrid';

import 'leaflet-draw';



import create from './create.mjs';

import attribution from './attribution.mjs';

import locate from './locate.mjs';

import popup from './popup.mjs';

import btn from './btn.mjs';

import panes from './panes.mjs';

export default _xyz => {

  _xyz.mapview = {};

  _xyz.mapview.lib = {
    L: L,
    featureGroup: L.featureGroup,
    circleMarker: L.circleMarker,
    circle: L.circle,
    polyline: L.polyline,
    polygon: L.polygon,
    rectangle: L.rectangle,
    geoJSON: geoJSON,
  };

  function geoJSON(params){

    return _xyz.mapview.lib.L.geoJson(params.json, {
      interactive: params.interactive || false,
      pane: params.pane || 'default',
      pointToLayer: (feature, latlng) => new _xyz.mapview.lib.L.Marker(latlng, {
        interactive: params.interactive || false,
        pane: params.pane || 'default',
        icon: _xyz.mapview.lib.L.icon({
          iconUrl: params.style.icon.url,
          iconSize: params.style.icon.size,
          iconAnchor: params.style.icon.anchor
        })
      }),
      style: params.style || {}
    }).addTo(_xyz.map);

  }

  _xyz.mapview.create = create(_xyz);

  _xyz.mapview.changeEndEvent = new CustomEvent('changeEnd');

  _xyz.mapview.attribution = attribution(_xyz);

  _xyz.mapview.locate = locate(_xyz);

  _xyz.mapview.popup = popup(_xyz);

  _xyz.mapview.btn = btn(_xyz);

  _xyz.mapview.panes = panes(_xyz);

};