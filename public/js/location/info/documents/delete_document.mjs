export default (_xyz, record, entry, doc) => {

  const xhr = new XMLHttpRequest();

  xhr.open('GET', _xyz.host + '/api/location/edit/documents/delete?' + _xyz.utils.paramString({
    locale: _xyz.locale,
    layer: record.location.layer,
    table: record.location.table,
    field: entry.field,
    id: record.location.id,
    doc_id: doc.id,
    doc_src: encodeURIComponent(doc.src),
    token: _xyz.token
  }));

  xhr.onload = e => {

    if (e.target.status !== 200) return;
    document.getElementById(doc.id).remove();
  };
	
  xhr.send();
};