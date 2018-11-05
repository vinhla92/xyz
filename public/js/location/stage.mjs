import _xyz from '../_xyz.mjs';

export default (layer, marker, btn) => {
  let tooltip = _xyz.utils.createElement({
    tag: 'div',
    options: {
      classList: "stage-tooltip"
    }
  });

  _xyz.utils.createElement({
    tag: 'i',
    options: {
      textContent: 'cloud_upload',
      className: 'material-icons cursor noselect btn_header',
      title: 'Save to cloud'
    },
    style: {
      display: 'inline-block'
    },
    appendTo: tooltip,
    eventListener: {
      event: 'click',
      funct: e => {
          e.stopPropagation();
          
          let xhr = new XMLHttpRequest();

          // Make select tab active on mobile device.
          if (_xyz.view.mobile) _xyz.view.mobile.activateLayersTab();

          xhr.open('POST', _xyz.host + '/api/location/new?token=' + _xyz.token);
          xhr.setRequestHeader('Content-Type', 'application/json');
          
          xhr.onload = e => {
              if (e.target.status === 401) {
                  document.getElementById('timeout_mask').style.display = 'block';
                  return
              }

              if (e.target.status === 200) {
                  layer.get();
                  
                  layer.edited = false;
                  _xyz.resetEditSession(layer);
                  _xyz.switchState(layer, btn);

                  _xyz.locations.select({
                      layer: layer.key,
                      table: layer.table,
                      id: e.target.response,
                      marker: marker,
                      editable: layer.edit ? layer.edit.properties : false
                  });
              }
          }
          
          xhr.send(JSON.stringify({
              locale: _xyz.locale,
              layer: layer.key,
              table: layer.table,
              geometry: {
                  type: "Point",
                  coordinates: marker
              }}));
      }
    }
  }); 
  
  _xyz.utils.createElement({
    tag: 'i',
    options: {
      textContent: 'clear',
      className: 'material-icons cursor noselect btn_header',
      title: 'Remove feature'
    },
    style: {
      display: 'inline-block'
    },
    appendTo: tooltip,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
      
        //_xyz.switchState(layer, btn);
        //_xyz.resetEditSession(layer);
        console.log('stage complete');
  
      }
    }
  });
  return tooltip;
}