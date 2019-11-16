export default _xyz => function(record, callback){

  const gazetteer = this;

  gazetteer.clear && gazetteer.clear();

  if (gazetteer.input) gazetteer.input.value = record.label;

  const sources = {
    glx: glx,
    mapbox: mapbox,
    google: google,
  };

  sources[record.source](record, callback);
  
  function glx(record, callback) {

    _xyz.locations.select({
      locale: _xyz.workspace.locale.key,
      layer: _xyz.layers.list[record.layer],
      table: record.table,
      id: record.id,
      _flyTo: true,
    });

    callback && callback();
  }
  
  function mapbox(record, callback) {

    gazetteer.createFeature({
      type: 'Point',
      coordinates: record.marker
    });

    callback && callback();
  }

  function google (record, callback) {

    // Get the geometry from the gazetteer database.
    const xhr = new XMLHttpRequest();
  
    xhr.open('GET', _xyz.host +
      '/api/gazetteer/googleplaces?' +
      _xyz.utils.paramString({
        id: record.id,
        token: _xyz.token
      }));

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.onload = e => {
      
      // Send results to createFeature
      if (e.target.status === 200) gazetteer.createFeature(e.target.response);
    
      callback && callback(e.target.response);
    };
    
    xhr.send();
  }

};