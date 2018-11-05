import _xyz from '../../_xyz.mjs';

import pointOnFeature from '@turf/point-on-feature';

export default record => {

    record.upload = _xyz.utils.createElement({
        tag: 'i',
        options: {
            textContent: 'cloud_upload',
            className: 'material-icons cursor noselect btn_header',
            title: 'Save changes to cloud'
        },
        style: {
            display: 'none',
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

                xhr.open('POST', _xyz.host + '/api/location/update?token=' + _xyz.token);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = e => {

                    if (e.target.status !== 200) return;

                    // Hide upload symbol.
                    record.upload.style.display = 'none';

                    // Remove changed class from all changed entries.
                    let changedElements = record.drawer.querySelectorAll('.changed');
                    changedElements.forEach(el => el.classList.remove('changed'));

                    layer.get();

                    try {

                        let pof = pointOnFeature(record.location.L.toGeoJSON());

                        record
                            .location
                            .M
                            .getLayers()[0]
                            .setLatLng(L.latLng(pof.geometry.coordinates.reverse()));

                    } catch (err) {
                        Object.keys(err).forEach(key => !err[key] && delete err[key]);
                        console.error(err);
                    }
                };

                xhr.send(JSON.stringify({
                    locale: _xyz.locale,
                    layer: layer.key,
                    table: record.location.table,
                    id: record.location.id,
                    infoj: record.location.infoj,
                    geometry: record.location.L.toGeoJSON().features[0].geometry
                }));

            }
        }
    });
};