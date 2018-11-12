import _xyz from '../../_xyz.mjs';

export default record => {

  if (!record.location.edit || !record.location.edit.delete) return;

  _xyz.utils.createElement({
    tag: 'i',
    options: {
      textContent: 'delete',
      className: 'material-icons cursor noselect btn_header',
      title: 'Delete feature'
    },
    style: {
      color: record.color
    },
    appendTo: record.header,
    eventListener: {
      event: 'click',
      funct: e => {

        e.stopPropagation();

        const layer = _xyz.layers.list[record.location.layer];

        const xhr = new XMLHttpRequest();

        xhr.open('GET', _xyz.host + '/api/location/delete?' + _xyz.utils.paramString({
          locale: _xyz.locale,
          layer: layer.key,
          table: record.location.table,
          id: record.location.id,
          token: _xyz.token
        }));

        xhr.onload = e => {

          if (e.target.status !== 200) return;

          _xyz.map.removeLayer(layer.L);

          layer.get();

          record.drawer.remove();

          _xyz.hooks.filter('select', record.location.layer + '!' + record.location.table + '!' + record.location.id + '!' + record.location.marker[0] + ';' + record.location.marker[1]);

          record.location.geometries.forEach(geom => _xyz.map.removeLayer(geom));
          record.location = null;
          record.location.geometries = [];

          // Find free records in locations array.
          let freeRecords = _xyz.locations.list.filter(record => record.location);

          // Return from selection if no free record is available.
          if (freeRecords.length === 0) _xyz.locations.init();

        };
        xhr.send();

      }
    }
  });
};