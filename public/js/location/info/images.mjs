import _xyz from '../../_xyz.mjs';

export default (record, entry) => {

  const images = entry.value.reverse() || [];

  val.style.position = 'relative';
  val.style.height = '180px';

  // create image container
  const img_container = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'img-container'
    }
  });

  // image table row which holds the image array
  const img_tr = _xyz.utils.createElement({
    tag: 'tr',
    appendTo: img_container
  });

  // add image picker
  const img_td = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'addImageCell'
    },
    appendTo: img_tr
  });

  const add_img_label = _xyz.utils.createElement({
    tag: 'label',
    options: {
      htmlFor: 'addImage_' + record.letter
    },
    appendTo: img_td
  });

  _xyz.utils.createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect',
      textContent: 'add_a_photo'
    },
    appendTo: add_img_label
  });

  const add_img = _xyz.utils.createElement({
    tag: 'input',
    options: {
      id: 'addImage_' + record.letter,
      type: 'file',
      accept: 'image/*;capture=camera'
    },
    appendTo: img_td
  });

  // empty the file input value
  add_img.addEventListener('click', function(){
    this.value = '';
  });
    
  // add change event 
  add_img.addEventListener('change', function () {

    let newImage = document.createElement('td');

    let reader = new FileReader();

    reader.onload = function (readerOnload) {

      let img = new Image();

      img.onload = function () {

        let
          canvas = document.createElement('canvas'),
          max_size = 1024,
          width = img.width,
          height = img.height;

        // resize
        if (width > height) {

          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }

        } else {

          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }

        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        const dataURL = canvas.toDataURL('image/jpeg', 0.5);

        const _img = _xyz.utils.createElement({
          tag: 'img',
          options: {
            src: dataURL
          },
          style: {
            border: '3px solid #090'
          }
        });

        // add delete button / control
        const btn_del = _xyz.utils.createElement({
          tag: 'button',
          options: {
            title: 'Delete image',
            className: 'btn_del',
            innerHTML: '<i class="material-icons">delete_forever</i>'
          },
          appendTo: newImage,
          eventListener: {
            event: 'click',
            funct: () => {
              newImage.remove();
            }
          }
        });
                    
        // add save button / control
        const btn_save = _xyz.utils.createElement({
          tag: 'button',
          options: {
            title: 'Save image',
            className: 'btn_save',
            innerHTML: '<i class="material-icons">cloud_upload</i>'
          },
          appendTo: newImage,
          eventListener: {
            event: 'click',
            funct: () => {
              btn_del.remove();
              btn_save.remove();
              upload_image(record, _img, dataURLToBlob(dataURL));
            }
          }
        });

        newImage.appendChild(_img);
      };

      img.src = readerOnload.target.result;

    };
    reader.readAsDataURL(this.files[0]);

    // insert new image before last image
    img_tr.insertBefore(newImage, img_tr.childNodes[1]);
  });

  // add images if there are any
  for (let image of images) {
        
    const td = _xyz.utils.createElement({
      tag: 'td',
      appendTo: img_tr
    });

    const img = _xyz.utils.createElement({
      tag: 'img',
      options: {
        id: image.replace(/.*\//, '').replace(/\.([\w-]{3})/, ''),
        src: image
      },
      style: {
        border: '3px solid #EEE'
      },
      appendTo: td
    });

    // add delete button / control
    _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Delete image',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">delete_forever</i>'
      },
      appendTo: td,
      eventListener: {
        event: 'click',
        funct: e => {
          e.target.remove();
          remove_image(record, img);
        }
      }
    });
  }
  
  val.appendChild(img_container);
};

function upload_image(record, img, blob) {

  const xhr = new XMLHttpRequest();

  xhr.open('POST', _xyz.host + '/api/images/new?' + _xyz.utils.paramString({
    dbs: record.location.dbs,
    table: record.location.table,
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
          remove_image(record, img);
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
}

function remove_image(record, img) {
        
  const xhr = new XMLHttpRequest();

  xhr.open('GET', _xyz.host + '/api/images/delete?' + _xyz.utils.paramString({
    locale: _xyz.locale,
    layer: record.location.layer,
    table: record.location.table,
    id: record.location.id,
    image_id: img.id,
    image_src: encodeURIComponent(img.src),
    token: _xyz.token
  }));

  xhr.onload = e => {

    if (e.target.status === 200) return console.log('remove_image failed');

    console.log('image_remove success');
    document.getElementById(img.id).remove();
  };

  xhr.send();
}

function dataURLToBlob(dataURL) {

  if (dataURL.indexOf(';base64,') == -1) {
    let
      parts = dataURL.split(','),
      contentType = parts[0].split(':')[1],
      raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  let
    parts = dataURL.split(';base64,'),
    contentType = parts[0].split(':')[1],
    raw = window.atob(parts[1]),
    uInt8Array = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}