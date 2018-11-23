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
    
      xhr.open('GET', _xyz.host + '/api/location/select/aggregate?' + _xyz.utils.paramString({
        locale: _xyz.locale,
        layer: layer.key,
        table: layer.table,
        filter: JSON.stringify(filter),
        token: _xyz.token
      }));
    
      xhr.onload = e => {

        if (e.target.status !== 200) return;

        const json = JSON.parse(e.target.response);
    
        // Find free records in locations array.
        let freeRecords = _xyz.locations.list.filter(record => !record.location);

        // Return from selection if no free record is available.
        if (freeRecords.length === 0) return;

        // Assign location to the first free record.
        const record = freeRecords[0];

        record.location = {
          geometry: JSON.parse(json.geomj),
          infoj: json.infoj,
          layer: layer.key
        };

        // Draw the record to the map.
        _xyz.locations.draw(record);

        // List the record
        _xyz.locations.add(record);

      };
    
      xhr.send();
    }
  }
});