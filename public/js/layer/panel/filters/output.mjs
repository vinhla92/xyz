import _xyz from '../../../_xyz.mjs';

export default (panel, layer) => _xyz.utils.createElement({
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

      // Create filter from legend and current filter.
      const filter = Object.assign({},layer.filter.current,layer.filter.legend);
    
      xhr.open('GET', _xyz.host + '/api/location/new/aggregate?' + _xyz.utils.paramString({
        locale: _xyz.locale,
        layer: layer.key,
        token: _xyz.token,
        filter: JSON.stringify(filter)
      }));
    
      xhr.onload = e => {

        if (e.target.status !== 200) return;

        let json = JSON.parse(e.target.response);
    
        _xyz.locations.select({
          layer: layer.filter.output.layer,
          table: _xyz.layers.list[layer.filter.output.layer].table,
          id: json.id,
          marker: [json.lng, json.lat]
          //filter: JSON.stringify(layer.filter.current) || ''
        });

      };
    
      xhr.send();
    }
  }
});