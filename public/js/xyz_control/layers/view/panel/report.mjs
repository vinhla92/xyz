export default (_xyz, layer) => {

  if (!layer.report) return;

  if (!layer.report.templates) return;


  Object.entries(layer.report.templates).forEach(entry => {

    const href = _xyz.host + '/report?' + _xyz.utils.paramString(
      Object.assign(
        entry[1],
        {
          locale: _xyz.workspace.locale.key,
          layer: layer.key,
          token: _xyz.token
        }
      )
    );

    layer.view.dashboard.appendChild(
      _xyz.utils.wire()`
      <a
      target="_blank"
      href="${href}"
      class="link-with-img">
        <img class="icon-event-note"><span>${entry[1].name || entry[0]}`
    );

  });
  
};