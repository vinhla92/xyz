import _xyz from '../../_xyz.mjs';

export default (record, entry) => {

  console.log(entry);
  console.log(record);

  let tr = _xyz.utils.createElement({ tag: 'tr', appendTo: record.table });

  let td = _xyz.utils.createElement({
    tag: 'td',
    appendTo: tr,
    options: {
      colSpan: '2'
    }
  });

  record.catchment = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'btn_wide cursor noselect',
      textContent: entry.value ? 'Delete' : 'Create'
    },
    appendTo: td,
    eventListener: {
      event: 'click',
      funct: e => {
        //console.log('create or delete catchment');
        entry.value ? deleteCatchment(e, record, entry) : createCatchment(e, record, entry);
      }
    }
  });

  console.log(record);
  //console.log(record.location.geometry);
  //console.log(entry.edit.catchment);

  function createCatchment(ev, record, entry){

    console.log('create');
    
    entry.edit.catchment.coordinates = record.location.geometry.coordinates.join(',');

    var xhr = new XMLHttpRequest();
    
    xhr.open('POST', _xyz.host + '/api/location/catchment?token=' + _xyz.token); // request from third party API
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = e => {
    
      if (e.target.status === 401) {
        document.getElementById('timeout_mask').style.display = 'block';
        _xyz.dom.map.style.cursor = '';
        //console.log(e.target.response);
        return;
      }
  
      if(e.target.status == 406){
        return alert(e.target.responseText);
      }
  
      if (e.target.status === 200) {

        ev.target.classList.remove('disabled');
        ev.target.textContent = 'Delete';
        
        let json = JSON.parse(e.target.response);
        if(json.features){
          let feature = json.features[0].geometry;

          entry.value = feature;

          xhr = new XMLHttpRequest();
          xhr.open('POST', _xyz.host + '/api/location/catchment/location?token=' + _xyz.token); // to change
          xhr.setRequestHeader('Content-Type', 'application/json');

          xhr.onload = e => {
            console.log(e.statusCode);
            //console.log('update request callback');
          };

          /*xhr.send(JSON.stringify({ // update feature
            locale: _xyz.locale,
            layer: record.location.layer,
            table: record.location.table,
            qID: record.location.qID,
            id: record.location.id,
            infoj: record.location.infoj,
            geom: record.location.geom
          }));*/

          console.log({ // update feature
            locale: _xyz.locale,
            layer: record.location.layer,
            table: record.location.table,
            qID: record.location.qID,
            id: record.location.id,
            infoj: record.location.infoj,
            geom: record.location.geom
          });

          //console.log(json.features);
          //entry.val = true;
          // do things here
        } else { return alert('No route found. Try a longer travel time.'); }
      
      }
    };
    
    xhr.send(JSON.stringify(entry.edit.catchment)); // get catchment contour
    _xyz.dom.map.style.cursor = 'busy';
    record.catchment.classList.add('disabled');

  }

  function deleteCatchment(ev, record, entry){
    ev.target.textContent = 'Create';
    console.log('delete');
    entry.value = null;
  }


  
  
  


  


};