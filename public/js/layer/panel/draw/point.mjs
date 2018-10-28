import _xyz from '../../../_xyz.mjs';
import style from './style.mjs';
import stage from '../../../location/stage.mjs';

_xyz.locations.stage = stage;

export default (e, layer) => {
    e.stopPropagation();

    _xyz.resetEditSession(layer);

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

        layer.edit.stage = L.featureGroup().addTo(_xyz.map);

        _xyz.map.once('click', e => {
            let marker = [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)];

            layer.edit.stage.addLayer(L.circleMarker(e.latlng, style(layer).point)).bindTooltip(_xyz.locations.stage(layer, marker, btn), {permanent: true, direction: "right"}).openTooltip();

            _xyz.dom.map.style.cursor = '';
            
            // Make select tab active on mobile device.
            if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();
            
        });
    }
}