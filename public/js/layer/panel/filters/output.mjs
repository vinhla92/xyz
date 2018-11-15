import _xyz from '../../../_xyz.mjs';

export default (panel) => _xyz.utils.createElement({
  tag: 'div',
  options: {
    className: 'btn_wide cursor noselect',
    textContent: 'Run Output',
  },
  style: {
    display: 'none'
  },
  appendTo: panel,
  eventListener: {
    event: 'click',
    funct: () => {
    
      const xhr = new XMLHttpRequest();
    
      xhr.open('GET', _xyz.host + '/api/location/aggregate?' + _xyz.utils.paramString({
        locale: _xyz.locale,
        layer: layer.key,
        token: _xyz.token,
        filter: JSON.stringify(layer.filter.current) || ''
      }));
    
      xhr.onload = e => {
        if (e.target.status === 200) {
          let json = JSON.parse(e.target.response);
    
          _xyz.locations.select({
            layer: layer.aggregate_layer,
            table: _xyz.layers.list[layer.aggregate_layer].table,
            id: json.id,
            marker: [json.lng, json.lat],
            filter: JSON.stringify(layer.filter.current) || ''
          });
        }
      };
    
      xhr.send();
    }
  }
});