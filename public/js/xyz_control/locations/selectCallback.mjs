export default _xyz => location => {

  // Create location view.
  location.view();

  // Draw location to map. Point locations have no style and are invisible.
  location.Layer = _xyz.mapview.geoJSON({
    geometry: location.geometry,
    pane: location.style.pane || 'select',
    style: [
      new _xyz.mapview.lib.style.Style({
        stroke: new _xyz.mapview.lib.style.Stroke({
          color: 'rgba(255, 255, 255, 0.2)',
          width: 8
        }),
      }),
      new _xyz.mapview.lib.style.Style({
        stroke: new _xyz.mapview.lib.style.Stroke({
          color: 'rgba(255, 255, 255, 0.2)',
          width: 6
        }),
      }),
      new _xyz.mapview.lib.style.Style({
        stroke: new _xyz.mapview.lib.style.Stroke({
          color: 'rgba(255, 255, 255, 0.2)',
          width: 4
        }),
      }),
      new _xyz.mapview.lib.style.Style({
        stroke: new _xyz.mapview.lib.style.Stroke({
          color: location.style.color,
          width: 2
        }),
        fill: new _xyz.mapview.lib.style.Fill({
          color: _xyz.utils.chroma(location.style.color).alpha(location.style.fillOpacity === 0 ? 0 : parseFloat(location.style.fillOpacity) || 1).rgba()
        }),
        // The default callback does not assign an image style for selected point locations.
      })
    ],
    dataProjection: _xyz.layers.list[location.layer].srid,
    featureProjection: _xyz.mapview.srid
  });

  // Draw location marker.
  location.Marker = _xyz.mapview.geoJSON({
    geometry: {
      type: 'Point',
      coordinates: location.marker,
    },
    style: new _xyz.mapview.lib.style.Style({
      image: _xyz.mapview.icon({
        type: 'markerLetter',
        letter: String.fromCharCode(64 + _xyz.locations.list.length - _xyz.locations.list.indexOf(location.record)),
        color: location.style.color,
        size: 40,
        anchor: [0.5, 1],
      })
    })
  });

  // if (location._flyTo) location.flyTo();
    
  // Create an alert with the locations infoj if mapview popup is not defined.
  if (!_xyz.mapview.popup) return alert(JSON.stringify(location.infoj, _xyz.utils.getCircularReplacer(), ' '));

  // Add location to list view if initialised.
  if (_xyz.locations.listview.node) return _xyz.locations.listview.add(location);
    
  // Create mapview popup with the locations view node.
  _xyz.mapview.popup.create({
    coords: location.marker,
    content: location.view.node
  });

};