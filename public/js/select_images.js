const utils = require('./utils');

function addImages(record, images) {

    // create image container
    let img_container = utils.createElement('div', {
        className: 'img-container'
    })

    // image table row which holds the image array
    let img_tr = document.createElement('tr');
    img_container.appendChild(img_tr);

    // add image picker
    let img_td = utils.createElement('td', {
        className: 'addImageCell',
    });
    img_tr.appendChild(img_td);

    let add_img_label = utils.createElement('label', {
        htmlFor: 'addImage_' + record.letter,
    });
    img_td.appendChild(add_img_label);

    let add_img_icon = utils.createElement('i', {
        className: 'material-icons cursor noselect',
        textContent: 'add_a_photo'
    });
    add_img_label.appendChild(add_img_icon);

    let add_img = utils.createElement('input', {
        id: 'addImage_' + record.letter,
        type: 'file',
        accept: 'image/*;capture=camera'
    });
    
    img_td.appendChild(add_img);

    // add images if there are any
    for (let image of images) {
        img_td = document.createElement('td');
        img_tr.appendChild(img_td);
        let _img = utils.createElement('img', {
            id: image,
            src: localhost + 'q_get_image?image=' + image
        });
        _img.style.border = '3px solid #EEE';

        // add delete button / control
        let btn_del = utils.createElement('button', {
            title: 'Delete image',
            className: 'btn_del',
            innerHTML: '<i class="material-icons">delete_forever</i>'
        });
        btn_del.addEventListener('click', function () {
            remove_image(record, _img);
            this.remove();
        });
        img_td.appendChild(btn_del);

        // append image to table cell
        img_td.appendChild(_img);
    }

    // add change event 
    add_img.addEventListener('change', function () {

        let newImage = document.createElement('td');

        let reader = new FileReader();
        reader.onload = function (readerOnload) {

            let img = new Image();
            img.onload = function () {

                let canvas = document.createElement('canvas'),
                    max_size = _xyz.layers.imageMaxSize,
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

                let dataURL = canvas.toDataURL('image/jpeg', 0.5);
                let _img = utils.createElement('img', {
                    src: dataURL
                });
                _img.style.border = '3px solid #090';

                // add delete button / control
                let btn_del = utils.createElement('button', {
                    title: 'Delete image',
                    className: 'btn_del',
                    innerHTML: '<i class="material-icons">delete_forever</i>'
                });
                btn_del.addEventListener('click', function () {
                    newImage.remove();
                });
                newImage.appendChild(btn_del);
                    
                // add save button / control
                let btn_save = utils.createElement('button', {
                    title: 'Save image',
                    className: 'btn_save',
                    innerHTML: '<i class="material-icons">cloud_upload</i>'
                });
                btn_save.addEventListener('click', function () {
                    btn_del.remove();
                    btn_save.remove();
                    upload_image(record, _img, utils.dataURLToBlob(dataURL));
                });
                newImage.appendChild(btn_save);

                newImage.appendChild(_img);

            }

            img.src = readerOnload.target.result;

        }
        reader.readAsDataURL(this.files[0])

        // insert new image before last image
        img_tr.insertBefore(newImage, img_tr.childNodes[1]);
    });

    return img_container;
}

function upload_image(record, _img, blob) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', localhost + 'q_save_image?' + utils.paramString({
        dbs: record.layer.dbs,
        table: record.layer.table,
        qID: record.layer.qID,
        id: record.layer.id,
        type: blob.type
    }));
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.onload = function () {
        if (this.status === 200) {
            _img.style.border = '3px solid #eee';

            // add delete button / control
            let btn_del = utils.createElement('button', {
                title: 'Delete image',
                className: 'btn_del',
                innerHTML: '<i class="material-icons">delete_forever</i>'
            });
            btn_del.addEventListener('click', function () {
                _img.remove();
            });
            _img.parentElement.appendChild(btn_del);
        }
    }
    _img.style.opacity = '0'
    xhr.onprogress = function (e) {
        if (e.lengthComputable) {
            _img.style.opacity = e.loaded / e.total;
        }
    }
    xhr.send(blob);
}

function remove_image(record, _img) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', localhost + 'q_remove_image?' + utils.paramString({
        dbs: record.layer.dbs,
        table: record.layer.table,
        qID: record.layer.qID,
        id: record.layer.id,
        filename: _img.id
    }));
    xhr.onload = function () {
        if (this.status === 200) {
            _img.remove();
            console.log(this.responseText);
        }
    }
    xhr.send();
}

module.exports = {
    addImages: addImages
}