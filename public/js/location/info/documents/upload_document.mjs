import delete_document from './delete_document.mjs';

export default (_xyz, record, entry, doc, formData) => {

  const xhr = new XMLHttpRequest();

  xhr.open('POST', _xyz.host + '/api/location/edit/documents/upload?' + _xyz.utils.paramString({
    dbs: record.location.dbs,
    table: record.location.table,
    field: entry.field,
    qID: record.location.qID,
    id: record.location.id,
    token: _xyz.token
  }), true);

  //xhr.setRequestHeader('Content-Type', 'application/octet-stream');

  xhr.onload = e => {
    if (e.target.status !== 200) return console.log('document_upload failed');

    const json = JSON.parse(e.target.responseText);

    doc.style.opacity = 1;
    doc.style.border = '3px solid #eee';
    doc.id = json.doc_id;
    doc.src = json.doc_url;

    // add delete button / control
    _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Delete document',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">delete_forever</i>'
      },
      appendTo: img.parentElement,
      eventListener: {
        event: 'click',
        funct: e => {
          e.target.remove();
          delete_document(_xyz, record, entry, doc);
        }
      }
    });

  };

  xhr.send(formData);
  return false;

};