export default _xyz => param => {

  if (!param.entry || !param.entry.location) return;

  const xhr = new XMLHttpRequest();

  xhr.open('GET', _xyz.host + '/api/location/pgfunction?' + _xyz.utils.paramString({
    locale: _xyz.workspace.locale.key,
    layer: param.entry.location.layer,
    id: param.entry.location.id,
    pgFunction: param.entry.pgFunction,
    token: _xyz.token
  }));

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';

  xhr.onprogress = e => {
    // put a spinner here or something 
  }

  xhr.onload = e => {

    if (e.target.status !== 200) return;

    param.entry.fields = e.target.response;

    let chartElem = _xyz.charts.create(param.entry);

    if(!chartElem || !chartElem.style) return;

    chartElem.style.minWidth = param.entry.chart.width ? `${param.entry.chart.width}px` : '450px';
    chartElem.style.minHeight = param.entry.chart.height ? `${param.entry.chart.height}px` : '300px';
    chartElem.style.maxWidth = param.entry.chart.width ? `${param.entry.chart.width}px` : '450px';
    chartElem.style.maxHeight = param.entry.chart.height ? `${param.entry.chart.height}px` : '300px';
          
    param.container.appendChild(chartElem);
  }

  xhr.send();

}
