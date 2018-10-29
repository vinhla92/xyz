import _xyz from '../../../_xyz.mjs';
import marker from '../../../svg_symbols.mjs';

export default (e, layer) => {
    e.stopPropagation();

    layer.edited = layer.edited ? false : true;

    let btn = e.target;

    if(layer.edited && !layer.display){
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
            let _marker = [e.latlng.lng, e.latlng.lat];
            layer.edit.catchment.coordinates = _marker.join(",");
            
            console.log(layer.edit.catchment);

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

            // post request here
            let xhr = new XMLHttpRequest();
            xhr.open('POST', _xyz.host + '/api/location/catchment?token=' + _xyz.token);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = e => {
                if (e.target.status === 401) {
                    document.getElementById('timeout_mask').style.display = 'block';
                    //console.log(e.target.response);
                    return
                }

                if(e.target.status === 200){
                    console.log('status 200');
                }
            }

            xhr.send(JSON.stringify(layer.edit.catchment));
            //console.log(layer.edit.catchment);
        });
    }
}