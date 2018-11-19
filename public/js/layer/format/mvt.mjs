import _xyz from '../../_xyz.mjs';

import L from 'leaflet';

import 'leaflet.vectorgrid';

export default function(){

  const layer = this;
  layer.loaded = false;

  // Set locale to check whether locale is still current when data is returned from backend.
  const locale = _xyz.locale;

  if (!layer.table || !layer.display) return _xyz.layers.check(layer);

  let url = _xyz.host + '/api/layer/mvt/{z}/{x}/{y}?' + _xyz.utils.paramString({
      locale: _xyz.locale,
      layer: layer.key,
      table: layer.table,
      properties: layer.properties,
      filter: JSON.stringify(layer.filter.current),
      token: _xyz.token
    }),
    options = {
      rendererFactory: L.svg.tile,
      interactive: (layer.infoj && layer.qID) || false,
      pane: layer.key,
      getFeatureId: (f) => f.properties.id,
      vectorTileLayerStyles: {}
    };

  // set style for each layer
  options.vectorTileLayerStyles[layer.key] = applyLayerStyle;

  if (layer.L) _xyz.map.removeLayer(layer.L);

  layer.L = L.vectorGrid.protobuf(url, options)
    .on('error', err => console.error(err))
    .on('load', () => {
      //e.target.setFeatureStyle(e.layer.properties.id, applyLayerStyle);
      if (locale === _xyz.locale) _xyz.layers.check(layer);
    })
    .on('click', e => {
      if (e.layer.properties.selected) return;

      e.layer.properties.selected = true;

      function checkCurrentSelection(e) {
        let check = false;
        if (_xyz.hooks.current.select) {
          _xyz.hooks.current.select.map(item => {
            item = item.split('!');
            if (item[1] === layer.key && item[2] === layer.table && item[3] === String(e.layer.properties.id)) {
              check = true;
            }
          });
        }
        return check;
      }

      if (!checkCurrentSelection(e)) {
        // set cursor to wait
        let els = _xyz.map.getContainer().querySelectorAll('.leaflet-interactive');

        for (let el of els) {
          el.classList += ' wait-cursor-enabled';
        }
        // get selection
        _xyz.locations.select({
          layer: layer.key,
          table: layer.table,
          id: e.layer.properties.id,
          marker: [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)]
        });
        e.layer.properties.selected = false;
      } else {
        //console.log('feature ' + e.layer.properties.id + ' already selected');
      }

    })
    .on('mouseover', e => {
      e.target.setFeatureStyle(e.layer.properties.id, layer.style.highlight);
    })
    .on('mouseout', e => {
      e.target.setFeatureStyle(e.layer.properties.id, applyLayerStyle);
    })
    .addTo(_xyz.map);

  function applyLayerStyle(properties, zoom) {

    if (!layer.style.theme) return layer.style.default;

    const theme = layer.style.theme;

    if (theme.type === 'categorized' && theme.cat[properties[theme.field]]) {

      return Object.assign({}, layer.style.default, theme.cat[properties[theme.field]]);

    }

    if (theme.type === 'graduated') {

      const cats = Object.entries(theme.cat);

      let cat_style = {};

      for (let i = 0; i < cats.length; i++) {

        if (parseFloat(properties[theme.field]) < parseFloat(cats[i][0])) break;

        cat_style = cats[i][1];

      }

      return Object.assign({}, layer.style.default, cat_style);

    }

  }
}