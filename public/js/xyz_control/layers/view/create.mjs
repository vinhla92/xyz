export default _xyz => layer => {

    layer.view = _xyz.utils.wire()`<div class="drawer">`;

    // Make the layer view opaque if no table is available for the current zoom level.
    if (layer.tables) _xyz.mapview.node.addEventListener('changeEnd', () => {
        layer.view.style.opacity = !layer.tableCurrent() ? 0.4 : 1;
    });
    
    const header = _xyz.utils.wire()`
    <div class="header enabled"><div>${layer.name || layer.key}`;
  
    // Add symbol to layer header.
    if (layer.format === 'cluster' && layer.style.marker) {
    
      header.appendChild(_xyz.utils.wire()`
      <img title="Default icon"
        style="float: right; cursor: help;"
        src="${_xyz.utils.svg_symbols(layer.style.marker)}">`);
    }
  
    header.appendChild(_xyz.utils.wire()`
    <button
      title="Zoom to filtered layer extent"
      class="cursor noselect btn_header xyz-icon icon-fullscreen"
      onclick=${e=>{
        e.stopPropagation();
        layer.zoomToExtent();
      }}>`);
   
    header.toggleDisplay = _xyz.utils.wire()`
    <button
      title="Toggle visibility"
      class="${'btn_header xyz-icon icon-toggle ' + (layer.display && 'on')}"
      onclick=${e=>{
        e.stopPropagation();
             
        layer.display?
            layer.remove():
            layer.show();
      
      }}>`;
  
    header.appendChild(header.toggleDisplay);

    layer.view.addEventListener('toggleDisplay', 
        ()=>header.toggleDisplay.classList.toggle('on'));
  
    layer.view.appendChild(header);

    const dashboard = _xyz.utils.wire()`<div class="dashboard">`;
  
    layer.view.appendChild(dashboard);

    // Create layer meta.
    if (layer.meta) {
        const meta = _xyz.utils.wire()`<p class="meta">`;
        meta.innerHTML = layer.meta;
        dashboard.appendChild(meta);
    }

    // Create & add Style panel.
    const style_panel = _xyz.layers.view.style.panel(layer);
    style_panel && dashboard.appendChild(style_panel);

    // Create & add Filter panel.
    const filter_panel = _xyz.layers.view.filter.panel(layer);
    filter_panel && dashboard.appendChild(filter_panel);

    // Create & add Filter panel.
    const draw_panel = _xyz.layers.view.draw(layer);
    draw_panel && dashboard.appendChild(draw_panel);

    if (!dashboard.children.length) return;

    // Assign methods to layer views with panels and or meta data.
    header.classList.add('pane_shadow');
    layer.view.classList.add('expandable');

    // Expander control for layer drawer.
    header.onclick = e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
            expandable: layer.view,
            accordeon: true
        });
    };

    header.appendChild(_xyz.utils.wire()`
    <button
      title="Toggle layer dashboard"
      class="cursor noselect btn_header expander xyz-icon icon-expander"
      onclick=${e=>{
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
            expandable: layer.view
        });
      }}>`);

    let panels = dashboard.querySelectorAll('.panel');

    // Expand first panel;
    panels && panels[0].classList.add('expanded');

}