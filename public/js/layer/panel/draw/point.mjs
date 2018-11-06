import _xyz from '../../../_xyz.mjs';
import style from './style.mjs';
import stage from '../../../location/stage.mjs';

export default (e, layer) => {
    e.stopPropagation();
    
    if(!layer.display) layer.show();
    
    layer.header.classList.add('edited');
    _xyz.dom.map.style.cursor = 'crosshair';
    
    layer.edit.stage = L.featureGroup().addTo(_xyz.map);
    
    _xyz.map.once('click', e => {
        let marker = [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)];
        
        layer.edit.stage
            .addLayer(L.circleMarker(e.latlng, style(layer).point))
            .bindTooltip(stage(layer, marker), {
                permanent: true, direction: "right"
            })
            .openTooltip();

        _xyz.dom.map.style.cursor = '';
    });
}