export default _xyz => function(term, params = {}){

  const gazetteer = this;

  // Abort the current search.
  gazetteer.xhr && gazetteer.xhr.abort();

  // Empty results.
  gazetteer.result && gazetteer.clear();

  // Create abortable xhr.
  gazetteer.xhr = new XMLHttpRequest();

  // Send gazetteer query to backend.
  gazetteer.xhr.open('GET', _xyz.host +
    '/api/gazetteer/autocomplete?' +
    _xyz.utils.paramString({
      locale: _xyz.workspace.locale.key,
      q: encodeURIComponent(term),
      source: params.source,
      token: _xyz.token
    }));

  gazetteer.xhr.setRequestHeader('Content-Type', 'application/json');

  gazetteer.xhr.responseType = 'json';

  gazetteer.xhr.onload = e => {

    if (e.target.status !== 200) return;
      
    // Parse the response as JSON and check for results length.
    const json = e.target.response;

    if (params.callback) return params.callback(json);

    // No results
    if (json.length === 0) {
      gazetteer.result.appendChild(_xyz.utils.wire()`
      <li style="padding: 5px 0;">No results for this search.</li>`);
      gazetteer.target.classList.add('active');
      return;
    }

    // Add results from JSON to gazetteer.
    Object.values(json).forEach(entry => {
      const li = _xyz.utils.wire()`<li>${entry.label}</li>`;
      Object.entries(entry).forEach(data => li['data-' + data[0]] = data[1]);
      gazetteer.result.appendChild(li);
      gazetteer.target.classList.add('active');
    });

  };

  gazetteer.xhr.send();

};