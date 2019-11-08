export default _xyz => layer => {

    if(!layer.infoj) return;
    
    if(!layer.infoj.some(entry => entry.filter)) return; 
  
    layer.filter.block = filter_entry => {
  
      const block = _xyz.utils.wire()`
      <div class="block">
      <div class="title primary-colour">${filter_entry.label}</div>
      <button
        class="icon-close cancel-btn filter primary-colour"
        onclick=${e=>{
  
          e.target.parentNode.remove();
          
          // Hide clear all filter.
          if(!layer.filter.list.children.length) layer.filter.clear_all.style.display = 'none';
  
          // Enable filter in select dropdown.
          layer.filter.select.querySelectorAll('ul li').forEach(li => {
            if(li.dataset.field === e.target.parentNode.dataset.field) li.classList.remove('selected');
          });
  
          delete layer.filter.current[filter_entry.field];
          
          layer.reload();
          
        }}>`;
    
      layer.filter.list.appendChild(block);
    
      return block;
    }

    layer.filter.reset = filter_entry => {

      filter_entry.el.parentNode.removeChild(filter_entry.el);
      filter_entry.el = null;
      if(!layer.filter.list.children.length) layer.filter.clear_all.style.display = 'none';
    }
  
    // Create current filter object.
    layer.filter.current = {};
  
    const infoj = layer.infoj.filter(entry => entry.filter);
  
    // Add select info to infoj array of filter entries.
    infoj.unshift('Select filter from list.');
  
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
      }}>Filter`);
  
    let filter_entries = {};
  
    Object.values(infoj).forEach(el => {
      if(el.field) filter_entries[el.field] = el.label || el.field
    });
  
    layer.filter.select = _xyz.utils.wire()`
      <button class="ul-drop">
      <div
        class="head"
        onclick=${e => {
          e.preventDefault();
          e.target.parentElement.classList.toggle('active');
        }}>
        <span class="ul-title">Select filter from list.</span>
        <div class="icon"></div>
      </div>
      <ul>
        ${Object.entries(filter_entries).map(
          keyVal => _xyz.utils.wire()`
            <li onclick=${e=>{
              const drop = e.target.closest('.ul-drop');
              drop.classList.toggle('active');
  
              const entry = infoj.find(entry => entry.field === keyVal[0]);
  
              // Display clear all button.
              layer.filter.clear_all.style.display = 'block';
        
              if (entry.filter == 'date') return _xyz.layers.view.filter.filter_date(layer, entry);
        
              if (entry.filter === 'numeric') return _xyz.layers.view.filter.filter_numeric(layer, entry);
        
              if (entry.filter === 'like' || entry.filter === 'match') return _xyz.layers.view.filter.filter_text(layer, entry);
        
              if (entry.filter.in) return _xyz.layers.view.filter.filter_in(layer, entry);
        
              if (entry.filter === 'boolean') return _xyz.layers.view.filter.filter_boolean(layer, entry);
  
            }}>${keyVal[1]}`)}`
  
    panel.appendChild(layer.filter.select);
  
    layer.filter.clear_all = _xyz.utils.wire()`
    <div
      class="btn_small cursor noselect primary-colour"
      style="margin: 4px;"
      onclick=${e=>{
  
        e.target.style.display = 'none';
  
        // Remove all filter blocks.
        layer.filter.list.innerHTML = null;
    
        // Enable all options.
        //layer.filter.select.querySelectorAll('ul li').forEach(li =>  li.classList.remove('selected', 'secondary-colour-bg'));
    
        // Reset layer filter object.
        layer.filter.current = {};
    
        layer.reload();
  
        layer.count(n => { layer.filter.run_output.disabled = !(n > 1) })
  
      }}>Clear all filters`;
  
    panel.appendChild(layer.filter.clear_all);
    
    // Create filter list container to store individual filter blocks.
    layer.filter.list = _xyz.utils.wire()`<div>`; // class="filter-list"
    
    panel.appendChild(layer.filter.list);
  
  
    layer.filter.run_output = _xyz.utils.wire()`
    <button
      class="btn_wide noselect primary-colour"
      onclick=${()=>{
  
        const filter = Object.assign({}, layer.filter.legend, layer.filter.current);
      
        const xhr = new XMLHttpRequest();
            
        xhr.open('GET', _xyz.host +
          '/api/location/select/aggregate?' +
          _xyz.utils.paramString({
            locale: _xyz.workspace.locale.key,
            layer: layer.key,
            table: layer.tableMin(),
            filter: JSON.stringify(filter),
            token: _xyz.token}));

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';

        xhr.onload = e => {
    
          if (e.target.status !== 200) return;
      
          _xyz.locations.select({
            _new: true,
            _flyTo: true,
            geometry: JSON.parse(e.target.response.geomj),
            infoj: e.target.response.infoj,
            layer: layer,
          });
        };

        xhr.send();
  
      }}>Run Output`;
  
    panel.appendChild(layer.filter.run_output);
  
    if (!layer.filter.infoj) layer.filter.run_output.style.display = 'none';
  
    layer.count(n => { layer.filter.run_output.disabled = !(n > 1) }); 

    return panel;

}