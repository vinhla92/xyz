import upload_document from './upload_document.mjs';

export default (_xyz, documentControl, entry) => {

// Add table cell for doc upload input.
  documentControl.add_doc_td = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'addDocCell'
    },
    appendTo: documentControl.row
  });


  // Add label for doc upload icon.
  documentControl.add_doc_label = _xyz.utils.createElement({
    tag: 'label',
    options: {
      htmlFor: 'addDoc_' + documentControl.record.letter
    },
    appendTo: documentControl.add_doc_td
  });

  // Add doc upload icon to label.
  _xyz.utils.createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect',
      textContent: 'attachment'
    },
    appendTo: documentControl.add_doc_label
  });

  // Add doc input.
  documentControl.add_doc_input = _xyz.utils.createElement({
    tag: 'input',
    options: {
      id: 'addDoc_' + documentControl.record.letter,
      type: 'file',
      //multiple: true,
      accept: '.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document;' // check this
    },
    appendTo: documentControl.add_doc_td
  });

  // empty the file input value
  documentControl.add_doc_input.addEventListener('click', () => {
    documentControl.add_doc_input.value = '';
  });


  // add change event 
  documentControl.add_doc_input.addEventListener('change', function (e){

    const newDoc = document.createElement('td');

    let file = this.files[0];
    let formData = new FormData();
    formData.append('file', file);

    //console.log('formData');
    //console.log(formData); // print this to see content, if name and extension can be accessed

    let file_meta = _xyz.utils.createElement({
      tag: 'div',
      appendTo: newDoc
    });

    let file_name = _xyz.utils.createElement({
      tag: 'div',
      options: {
        textContent: file.name
      },
      appendTo: file_meta
    });

    /*let file_size = _xyz.utils.createElement({
      tag: 'div',
      options: {
        textContent: file.size
      },
      appendTo: file_meta
    });*/

    // Add control to delete document which is not uploaded yet.
    const btn_del = _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Delete document',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">delete_forever</i>'
      },
      appendTo: newDoc,
      eventListener: {
        event: 'click',
        funct: () => {
          newDoc.remove();
          e.target.value = '';
        }
      }
    });

    // Add control to upload document
    const btn_save = _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Save document',
        className: 'btn_save',
        innerHTML: '<i class="material-icons">cloud_upload</i>'
      },
      appendTo: newDoc,
      eventListener: {
        event: 'click',
        funct: () => {
          btn_del.remove();
          btn_save.remove();
          e.target.value = '';
          //upload_document(...); 
        }
      }
    });

    //console.log(documentControl.row);
    // insert new image before last image
    documentControl.row.insertBefore(newDoc, documentControl.row.childNodes[1]);

  });

};