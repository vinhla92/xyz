import _xyz from '../../../_xyz.mjs';
import marker from '../../../svg_symbols.mjs';

export default (e, layer) => {
    e.stopPropagation();

    layer.edited = layer.edited ? false : true;

    let btn = e.target;

    if(layer.edited && !layer.display){ // display layer if hidden
        layer.display = true;
        layer.toggle.textContent = layer.display ? 'layers' : 'layers_clear';
        _xyz.hooks.push('layers', layer.key);
        layer.get();
    }

    if(!layer.edited){
        layer.header.classList.remove('edited')
    } else {
        layer.header.classList.add('edited');
        _xyz.dom.map.style.cursor = 'crosshair';

        layer.edit.origin = L.featureGroup().addTo(_xyz.map);

        _xyz.map.once('click', e => {
            let _marker = [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)];
            layer.edit.catchment.coordinates = _marker.join(",");
            
            layer.edit.origin.addLayer(L.marker([_marker[1], _marker[0]], {
                interactive: false,
                icon: L.icon({
                    iconUrl: marker({
                        type: "markerColor",
                        style: {
                            colorMarker: "#444",
                            colorDot: "#888"
                        }
                    }),
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                })
            }));

            _xyz.dom.map.style.cursor = '';
            layer.edited = false;
            _xyz.switchState(layer, btn);
            layer.header.classList.remove('edited');

            var xhr = new XMLHttpRequest();
            xhr.open('POST', _xyz.host + '/api/location/catchment?token=' + _xyz.token); // request from third party API
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = e => {
                if (e.target.status === 401) {
                    document.getElementById('timeout_mask').style.display = 'block';
                    //console.log(e.target.response);
                    return
                }

                if(e.target.status === 200){

                    let json = JSON.parse(e.target.response),
                        feature = json.features[0].geometry;

                    xhr = new XMLHttpRequest();
                    xhr.open('POST', _xyz.host + '/api/location/new?token=' + _xyz.token); // request to 'new' endpoint
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onload = e => {

                        layer.edit.origin.clearLayers(); // clear marker

                        layer.get();

                        // Make select tab active on mobile device.
                        if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();

                        _xyz.locations.select({ // select newly added feature
                            layer: layer.key,
                            table: layer.table,
                            id: e.target.response,
                            marker: _marker,
                            editable: layer.edit ? layer.edit.properties : false
                        });
                    };

                    xhr.send(JSON.stringify({ // add new feature
                        locale: _xyz.locale,
                        layer: layer.key,
                        table: layer.table,
                        geometry: feature
                    }));
                }
            }
            xhr.send(JSON.stringify(layer.edit.catchment)); // get catchment contour
        });
    }
}