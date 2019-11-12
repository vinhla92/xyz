export default _xyz => {

  const data = {

    panel: panel,

  }

  return data;


  function panel(layer) {

    if (!layer.dataview || !_xyz.dataview.node) return;

    if (!layer.dataview.tables && !layer.dataview.charts) return;

    const panel = _xyz.utils.wire()`
    <div class="drawer panel expandable">`;
  
    // Panel header
    panel.appendChild(_xyz.utils.wire()`
    <div
      class="header btn_text cursor noselect primary-colour"
      onclick=${e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent(e.target, true);
      }}>Data Views`);

    if (layer.dataview.tables) {

      Object.keys(layer.dataview.tables).forEach(key => {

        const table = layer.dataview.tables[key];

        table.key = key;
        table.layer = layer;
        table.title = table.title || key;

        table.target = _xyz.dataview.node.querySelector('.table') || _xyz.dataview.tableContainer();

        table.show = () => _xyz.dataview.layerTable(table);
        table.remove = () => _xyz.dataview.removeTab(table);

        // Create checkbox to toggle whether table is in tabs list.
        panel.appendChild(_xyz.utils.wire()`
        <label class="checkbox">
        <input
          type="checkbox"
          checked=${!!table.display}
          onchange=${e => {
            table.display = e.target.checked;
            if (table.display) return layer.show();
            table.remove();
          }}>
        </input>
        <div></div><span>${table.title}`);

        if (table.display && layer.display) table.show();
      });

    }

    if (layer.dataview.charts) {

      Object.keys(layer.dataview.charts).forEach(key => {

        const chart = layer.dataview.charts[key];

        chart.key = key;
        chart.layer = layer;
        chart.title = chart.title || key;

        chart.target = _xyz.dataview.node.querySelector('.table') || _xyz.dataview.tableContainer();

        chart.show = () => _xyz.dataview.layerDashboard(chart);
        chart.remove = () => _xyz.dataview.removeTab(chart);

        // Create checkbox to toggle whether table is in tabs list.
        panel.appendChild(_xyz.utils.wire()`
        <label class="checkbox">
        <input
          type="checkbox"
          checked=${!!chart.display}
          onchange=${e => {
            chart.display = e.target.checked;
            if (chart.display) return layer.show();
            chart.remove();
          }}>
        </input>
        <div></div><span>${chart.title}`);

        if (chart.display && layer.display) chart.show();
      });

    }

    return panel;

  };

}