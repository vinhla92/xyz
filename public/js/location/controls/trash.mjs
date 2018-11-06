import _xyz from '../../_xyz.mjs';

export default record => {

    if (!record.location.edit && !record.location.edit.delete) return;

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

                let
                    layer = _xyz.layers.list[record.location.layer],
                    xhr = new XMLHttpRequest();

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
                    if (record.location.L) _xyz.map.removeLayer(record.location.L);
                    if (record.location.M) _xyz.map.removeLayer(record.location.M);
                    if (record.location.D) _xyz.map.removeLayer(record.location.D);
                    record.location = null;

                    //console.log(_xyz);

                    // Find free records in locations array.
                    let freeRecords = _xyz.locations.list.filter(record => record.location);

                    // Return from selection if no free record is available.
                    if (freeRecords.length === 0) _xyz.locations.init();

                    // let freeRecords = _xyz.ws.select.layers.records.filter(record => {
                    // let freeRecords = _xyz.locations.list.filter(record => {
                    //  if (!record.location) return record;
                    // });

                    // if (freeRecords.length === _xyz.ws.select.layers.records.length) _xyz.ws.select.resetModule();
                };
                xhr.send();

            }
        }
    });
};