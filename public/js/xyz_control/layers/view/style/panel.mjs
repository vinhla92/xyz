export default _xyz => layer => {

  if (!layer.style) return;

  const panel = _xyz.utils.wire()`<div class="panel expandable">`;

  // Panel header
  panel.appendChild(_xyz.utils.wire()`
  <div
    class="btn_text cursor noselect primary-colour"
    onclick=${e => {
      e.stopPropagation();
      _xyz.utils.toggleExpanderParent({
        expandable: panel,
        accordeon: true,
      });
    }}>Style`);


  // Add toggle for label layer.
  layer.style.label && panel.appendChild(_xyz.utils.wire()`
  <label class="checkbox" style="margin-bottom: 10px;">
  <input type="checkbox"
    checked=${!!layer.style.label.display}
    onchange=${e => {
      layer.style.label.display = e.target.checked;
      layer.show();
    }}>
  </input>
  <div></div><span>Display Labels.`);

  // Add theme control
  if(layer.style.theme){

    // Assign 'Basic' style entry to themes object.
    const themes = Object.assign({"Basic": null}, layer.style.themes);

    panel.appendChild(_xyz.utils.wire()`<div>Select thematic style.`);

    panel.appendChild(_xyz.utils.wire()`
    <button class="ul-drop">
    <div
      class="head"
      onclick=${e => {
        e.preventDefault();
        e.target.parentElement.classList.toggle('active');
      }}>
      <span class="ul-title">${Object.keys(themes)[1]}</span>
      <div class="icon"></div>
    </div>
    <ul>
      ${Object.keys(themes).map(
        key => _xyz.utils.wire()`
        <li onclick=${e=>{
          const drop = e.target.closest('.ul-drop');
          drop.querySelector('.ul-title').textContent = key;
          drop.classList.toggle('active');
          layer.style.theme = themes[key];
          applyTheme(layer);
          layer.reload();
        }}>${key}`)}`);
          
  }
  
  // Apply the current theme.
  applyTheme(layer); 

  return panel;

  function applyTheme(layer) {

    // Empty legend.
    layer.style.legend && layer.style.legend.remove();

    if (layer.style.theme || layer.format === 'grid') return panel.appendChild(_xyz.layers.view.style.legend(layer));

    layer.style.legend = _xyz.utils.wire()`<div class="legend">`;

    layer.style.marker && _xyz.layers.view.style.clusterStyle(layer, layer.style.marker, 'Marker');

    layer.style.markerMulti && _xyz.layers.view.style.clusterStyle(layer, layer.style.markerMulti, 'MultiMarker');

    layer.style.default && _xyz.layers.view.style.polyStyle(layer, layer.style.default, 'Polygon');

    layer.style.highlight && _xyz.layers.view.style.polyStyle(layer, layer.style.highlight, 'Highlight');

    panel.appendChild(layer.style.legend);

  }

};