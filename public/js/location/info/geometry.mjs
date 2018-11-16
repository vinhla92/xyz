import _xyz from '../../_xyz.mjs';

export default (record, entry) => {

  if (!entry.value) return;

  const style = entry.style || {
    stroke: true,
    color: record.color,
    weight: 2,
    fill: true,
    fillOpacity: 0.3
  };

  const geometry = L.geoJson(
    {
      type: 'Feature',
      geometry: JSON.parse(entry.value)
    }, {
      interactive: false,
      pane: 'select_display',
      style: style
    }).addTo(_xyz.map);

  record.location.geometries.push(geometry);

};