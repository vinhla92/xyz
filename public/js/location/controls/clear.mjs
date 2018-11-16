import _xyz from '../../_xyz.mjs';

export default record => {
    
  _xyz.utils.createElement({
    tag: 'i',
    options: {
      textContent: 'clear',
      className: 'material-icons cursor noselect btn_header',
      title: 'Remove feature from selection'
    },
    style: {
      color: record.color
    },
    appendTo: record.header,
    eventListener: {
      event: 'click',
      funct: e => {

        e.stopPropagation();

        record.drawer.remove();

        if (_xyz.state && _xyz.state != 'select') _xyz.switchState(record.location.layer, _xyz.state);

        _xyz.hooks.filter('select', record.location.layer + '!' + record.location.table + '!' + record.location.id + '!' + record.location.marker[0] + ';' + record.location.marker[1]);

        record.location.geometries.forEach(geom => _xyz.map.removeLayer(geom));
        record.location = {};
        record.location.geometries = [];

        // Find free records in locations array.
        let freeRecords = _xyz.locations.list.filter(record => record.location);

        // Return from selection if no free record is available.
        if (freeRecords.length === 0) _xyz.locations.init();

      }
    }
  });
};