export default _xyz => {

  return {

    init: init,

  };

  function init(params) {

    // Assign the node for the layers listview.
    _xyz.layers.listview.node = params.target;

    // Empty the layers list.
    _xyz.layers.listview.node.innerHTML = '';

    // Reset groups.
    _xyz.layers.listview.groups = {};

    // Loop through the layers and add to layers list.
    Object.values(_xyz.layers.list).forEach(layer => {

      // Create the layer view.
      _xyz.layers.view.create(layer);

      if (!layer.group) return _xyz.layers.listview.node.appendChild(layer.view);

      // Create new layer group if group does not exist yet.
      if (!_xyz.layers.listview.groups[layer.group]) createGroup(layer);

      // Check for visible layer in exisiting layer group.
      _xyz.layers.listview.groups[layer.group].chkVisibleLayer();

      // Add group meta to group node.
      if (layer.groupmeta) {
        const groupmeta = _xyz.utils.wire()`<div class="meta primary-colour">`;
        groupmeta.innerHTML = layer.groupmeta;
        _xyz.layers.listview.groups[layer.group].meta.appendChild(groupmeta);
      }

      // Append the layer to the listview layer group.
      _xyz.layers.listview.groups[layer.group].node.appendChild(layer.view);

    });

  }


  function createGroup (layer){

    // Create group object.
    const group = {};

    // Assign layer group to listview object.
    _xyz.layers.listview.groups[layer.group] = group;

    // Create layer group node and append to listview node.
    group.node = _xyz.utils.wire()`
    <div class="drawer layer-group expandable">`;

    _xyz.layers.listview.node.appendChild(group.node);

    // Create layer group header.
    group.header = _xyz.utils.wire()`<div class="header enabled"><div>${layer.group}`;
    
    group.header.onclick = e => {
      e.stopPropagation();
      _xyz.utils.toggleExpanderParent(e.target, true);
    };

    group.node.appendChild(group.header);

    // Create layer group meta element.
    group.meta = _xyz.utils.wire()`<div>`;
    group.node.appendChild(group.meta);

    // Check whether some layers group are visible and toggle visible button display accordingly.
    group.chkVisibleLayer = () => {

      if (Object.values(_xyz.layers.list).some(_layer => _layer.display && _layer.group === layer.group)) {
        group.visible.classList.add('on');
        group.visible.disabled = false;
      } else {
        group.visible.classList.remove('on');
        group.visible.disabled = true;
      }

    };

    // Create hide all group layers button.
    group.visible = _xyz.utils.wire()`
    <button
      class="btn_header xyz-icon icon-toggle"
      title="Hide layers from group"
      onclick=${e=>{
        e.stopPropagation();

        // Iterate through all layers and remove layer if layer is in group.
        Object.values(_xyz.layers.list)
          .filter(_layer => _layer.group === layer.group && _layer.display)
          .forEach(_layer => _layer.remove())

      }}>`;

    group.header.appendChild(group.visible);

    // Create group expander button.
    group.header.appendChild(_xyz.utils.wire()`
    <button 
      class="xyz-icon btn_header icon-expander"
      title="Toggle group panel"
      onclick=${ e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent(e.target);
      }}>`);

  }

};