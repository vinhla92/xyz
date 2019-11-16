export default _xyz => function(term, params = {}){

  const gazetteer = this;

  // Empty results.
  gazetteer.clear && gazetteer.clear();

  // Abort existing xhr and create new.
  gazetteer.xhr && gazetteer.xhr.abort();
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
      
    if (params.callback) return params.callback(e.target.response);

    // No results
    if (e.target.response.length === 0) {
      gazetteer.result.appendChild(_xyz.utils.wire()`
      <li>No results for this search.`);
      return gazetteer.group.classList.add('active');
    }

    // Add results from JSON to gazetteer.
    Object.values(e.target.response).forEach(entry => {

      gazetteer.result.appendChild(_xyz.utils.wire()`
      <li onclick=${e=>{
        e.preventDefault();

        if (!entry.source || !entry.id) return;

        gazetteer.select({
          label: entry.label,
          id: entry.id,
          source: entry.source,
          layer: entry.layer,
          table: entry.table,
          marker: entry.marker,
        }, params.callback || null);

      }}>${entry.label}`);

      gazetteer.group.classList.add('active');
    });

  };

  gazetteer.xhr.send();
};