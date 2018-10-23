import _xyz from '../../../_xyz.mjs';
import _polygon from './polygon.mjs';
import _rect from './rectangle.mjs';
import _circle from './circle.mjs';
import _line from './line.mjs';
import _point from './point.mjs';

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

_xyz.switchState = switchState;
export function switchState(layer, btn){

    //_xyz.resetEditSession();

  if (_xyz.state == btn) {
    if(btn.classList.contains('active')) btn.classList.remove('active');
    _xyz.dom.map.style.cursor = '';
    return _xyz.state = 'select';
  }

  if (_xyz.state !== 'select') _xyz.state.classList.remove('active');

  _xyz.state = btn;
  _xyz.dom.map.style.cursor = 'crosshair';
  _xyz.state.classList.add('active');

  console.log(_xyz.state);
}

/*_xyz.resetEditSession = resetEditSession;
function resetEditSession(layer){
    //console.log(_xyz.layers);
    //Object.values(_xyz.layers.list).map(layer => {
        //_xyz.map.remove(layer.trail);
        //_xyz.map.remove(layer.path);
        //console.log(layer);
        //_xyz.map.remove(layer.vertices);
        if(layer.trail) layer.trail.clearLayers();
        if(layer.path) layer.path.clearLayers();
        if(layer.vertices) layer.vertices.clearLayers();
        _xyz.map.off('mousemove');
        _xyz.map.off('contextmenu');
       // _xyz.map.off('click');
        //layer.edited = false;
        //_xyz.map.off('click');
        //_xyz.dom.map.style.cursor = '';
        //layer.header.classList.remove('edited');
    //});
}*/