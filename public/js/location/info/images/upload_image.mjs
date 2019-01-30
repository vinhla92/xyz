import delete_image from './delete_image.mjs';

export default (_xyz, record, entry, img, dataURL) => {

  const blob = _xyz.utils.dataURLToBlob(dataURL);

  const xhr = new XMLHttpRequest();

  xhr.open('POST', _xyz.host + '/api/location/edit/images/upload?' + _xyz.utils.paramString({
    dbs: record.location.dbs,
    table: record.location.table,
    field: entry.field,
    qID: record.location.qID,
    id: record.location.id,
    token: _xyz.token
  }));

  xhr.setRequestHeader('Content-Type', 'application/octet-stream');

  xhr.onload = e => {

    if (e.target.status !== 200) return console.log('image_upload failed');

    const json = JSON.parse(e.target.responseText);

    img.style.opacity = 1;
    img.style.border = '3px solid #eee';
    img.id = json.image_id;
    img.src = json.image_url;

    // add delete button / control
    _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Delete image',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">delete_forever</i>'
      },
      appendTo: img.parentElement,
      eventListener: {
        event: 'click',
        funct: e => {
          e.target.remove();
          delete_image(_xyz, record, entry, img);
        }
      }
    });

  };

  img.style.opacity = '0';

  xhr.onprogress = e => {
    if (e.lengthComputable) {
      img.style.opacity = e.loaded / e.total;
    }
  };

  xhr.send(blob);
};