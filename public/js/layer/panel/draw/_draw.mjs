import _xyz from '../../../_xyz.mjs';
import _polygon from './polygon.mjs';
import _rect from './rectangle.mjs';
import _circle from './circle.mjs';
import _line from './line.mjs';
import _point from './point.mjs';
import _catchment from './catchment.mjs';

export function point(e, layer){
  _point(e, layer);
}

export function polygon(e, layer){
  _polygon(e, layer);
}

export function rect(e, layer){
  _rect(e, layer);
}

export function circle(e, layer){
  _circle(e, layer);
}

export function line(e, layer){
  _line(e, layer);
}

export function catchment(e, layer){
  _catchment(e, layer);
}

_xyz.switchState = switchState;
export function switchState(layer, btn){

    //_xyz.resetEditSession(layer);

  if (_xyz.state == btn) {
    if(btn.classList.contains('active')) btn.classList.remove('active');
    _xyz.dom.map.style.cursor = '';
    return _xyz.state = 'select';
  }

  if (_xyz.state !== 'select') {
    _xyz.state.classList.remove('active'); 
    _xyz.dom.map.style.cursor = '';
  }

  _xyz.state = btn;
  _xyz.dom.map.style.cursor = 'crosshair';
  _xyz.state.classList.add('active');

  //console.log(_xyz.state);
}

_xyz.resetEditSession = resetEditSession;
function resetEditSession(layer){
    if(layer.edit.trail) layer.edit.trail.clearLayers();
    if(layer.edit.path) layer.edit.path.clearLayers();
    if(layer.edit.vertices) layer.edit.vertices.clearLayers();
    if(layer.edit.stage) {
      layer.edit.stage.clearLayers();
      layer.edit.stage.unbindTooltip();
    }
    layer.header.classList.remove('edited');
    _xyz.dom.map.style.cursor = '';
}