import upload_document from './upload_document.mjs';

export default (_xyz, documentControl, record, entry) => {

  documentControl.add_doc = _xyz.utils.createElement({
    tag: 'div',
    options: {
      classList: 'addDocCell'
    },
    style: {
      display: 'block'
      // position: 'absolute',
      // height: '100px',
      // width: '100%'
    },
    appendTo: documentControl.container.parentNode
  });

  // Add table cell for doc upload input.
  /*documentControl.add_doc_td = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'addDocCell'
    },
    appendTo: documentControl.add_doc_tr
    //appendTo: entry.row
  });*/


  // Add label for doc upload icon.
  documentControl.add_doc_label = _xyz.utils.createElement({
    tag: 'label',
    options: {
      htmlFor: 'addDoc_' + documentControl.record.letter
    },
    appendTo: documentControl.add_doc
  });

  // Add doc upload icon to label.
  _xyz.utils.createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect',
      textContent: 'add_circle_outline'
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
    appendTo: documentControl.add_doc
  });


  // empty the file input value
  documentControl.add_doc_input.addEventListener('click', () => {
    documentControl.add_doc_input.value = '';
  });


  // add change event 
  documentControl.add_doc_input.addEventListener('change', function (e){

    const newDoc = document.createElement('tr');
    //const newDoc = document.createElement('tr');
    
    let newDoc_td = _xyz.utils.createElement({
      tag: 'td',
      appendTo: newDoc
    });

    const reader = new FileReader();

    reader.onload = blob => {
      documentControl.blob = blob.target.result;
      //console.log(blob.target.result);
    };

    let file = this.files[0];

    let public_id = file.name;

    reader.readAsDataURL(file);


    /*let file_meta = _xyz.utils.createElement({
      tag: 'div',
      appendTo: newDoc
    });*/

    let file_name = _xyz.utils.createElement({
      tag: 'a',
      options: {
        textContent: file.name,
        target: '_blank'
      },
      appendTo: newDoc_td//newDoc
    });

    /*let file_size = _xyz.utils.createElement({
      tag: 'div',
      options: {
        textContent: file.size
      },
      appendTo: file_meta
    });*/

    // Add control to delete document which is not uploaded yet.
    
    /*const btn_del = _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Delete document',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">clear</i>'
      },
      appendTo: newDoc_td,//newDoc,
      eventListener: {
        event: 'click',
        funct: () => {
          newDoc.remove();
        }
      }
    });*/

    const btn_del = _xyz.utils.createElement({
      tag: 'span',
      options: {
        title: 'Delete document',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">clear</i>'
      },
      appendTo: newDoc_td,//newDoc,
      eventListener: {
        event: 'click',
        funct: () => {
          newDoc.remove();
        }
      }
    });

    // Add control to upload document
    /*const btn_save = _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Save document',
        className: 'btn_save',
        innerHTML: '<i class="material-icons">cloud_upload</i>'
      },
      appendTo: newDoc_td,//newDoc,
      eventListener: {
        event: 'click',
        funct: () => {
          btn_del.remove();
          btn_save.remove();
          upload_document(_xyz, record, entry, newDoc, public_id, documentControl.blob); 
        }
      }
    });*/

    // Add control to upload document
    const btn_save = _xyz.utils.createElement({
      tag: 'span',
      options: {
        title: 'Save document',
        className: 'btn_save',
        innerHTML: '<i class="material-icons">cloud_upload</i>'
      },
      appendTo: newDoc_td,//newDoc,
      eventListener: {
        event: 'click',
        funct: () => {
          btn_del.remove();
          btn_save.remove();
          upload_document(_xyz, record, entry, newDoc_td, public_id, documentControl.blob); 
        }
      }
    });

    // insert new image before last image
    //documentControl.row.insertBefore(newDoc, documentControl.row.childNodes[0]);
    documentControl.row.appendChild(newDoc);

  });

};