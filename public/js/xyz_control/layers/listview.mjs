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
      _xyz.layers.view(layer);

      if (layer.group) {

        if (!_xyz.layers.listview.groups[layer.group]) {

          // Create new layer group if group does not exist yet.
          createGroup(layer);

        } else {

          // Check for visible layer in exisiting layer group.
          _xyz.layers.listview.groups[layer.group].chkVisibleLayer();
        }

        // Add group meta to group node.
        if (layer.groupmeta) {
          const groupmeta = _xyz.utils.wire()`<div class="meta">`;
          groupmeta.innerHTML = layer.groupmeta;
          _xyz.layers.listview.groups[layer.group].meta.appendChild(groupmeta);
        }

        // Append the layer to the listview layer group.
        _xyz.layers.listview.groups[layer.group].node.appendChild(layer.view.drawer);

      } else {

        // Append the layer to the listview node.
        _xyz.layers.listview.node.appendChild(layer.view.drawer);
      }

      // Show layer, if display is true.
      if (layer.display) layer.show();

    });

  }


  function createGroup (layer){

    // Create group object.
    const group = {};

    // Assign layer group to listview object.
    _xyz.layers.listview.groups[layer.group] = group;

    // Create layer group node and append to listview node.
    group.node = _xyz.utils.wire()`<div class="drawer drawer-group expandable-group">`;
    _xyz.layers.listview.node.appendChild(group.node);

    // Create layer group header.
    group.header = _xyz.utils.wire()`<div class="header-group enabled"><div>${layer.group}`;
    
    group.header.onclick = e => {
      e.stopPropagation();
      _xyz.utils.toggleExpanderParent({
        expandable: e.target.parentNode,
        expandedTag: 'expanded-group',
        expandableTag: 'expandable-group',
        accordeon: true
      });
    };

    group.node.appendChild(group.header);

    // Create layer group meta element.
    group.meta = _xyz.utils.wire()`<div>`;
    group.node.appendChild(group.meta);

    // Check whether some layers group are visible and toggle visible button display accordingly.
    group.chkVisibleLayer = () => {

      let someVisible = Object.values(_xyz.layers.list).some(_layer => (_layer.display && _layer.group === layer.group));

      if (someVisible) {
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
        Object.values(_xyz.layers.list).forEach(_layer => {
          if (_layer.group === layer.group && _layer.display) _layer.view.header.toggleDisplay.click();
        });
      }}>`;
    group.header.appendChild(group.visible);

    // Create group expander button.
    group.header.appendChild(_xyz.utils.wire()`
    <button
      class="btn_header xyz-icon icon-expander"
      title="Toggle group panel"
      onclick=${e=>{
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
          expandable: group.node,
          expandedTag: 'expanded-group',
          expandableTag: 'expandable-group'
        });
      }}>`
    );
    
  }

};