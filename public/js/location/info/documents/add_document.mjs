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
  documentControl.add_doc_input.addEventListener('click', () => documentControl.add_doc_input.value);

  // add change event 
  documentControl.add_doc_input.addEventListener('change', function (){

    console.log(this);
    //if ('files' in x) {}

    const newDoc = document.createElement('td');
    const reader = new FileReader();

    reader.onload = function (readerOnload) {

      const doc = new File();

      doc.onload = function(){

        // do something here to display added file
        // Add control to delete image which is not uploaded yet.
        const btn_del = _xyz.utils.createElement({
          tag: 'button',
          options: {
            title: 'Delete document',
            className: 'btn_del',
            innerHTML: '<i class="material-icons">delete_forever</i>'
          },
          appendTo: newImage,
          eventListener: {
            event: 'click',
            funct: () => {
              newDoc.remove();
            }
          }
        });

        // Add control to upload image.
        const btn_save = _xyz.utils.createElement({
          tag: 'button',
          options: {
            title: 'Save document',
            className: 'btn_save',
            innerHTML: '<i class="material-icons">cloud_upload</i>'
          },
          appendTo: newImage,
          eventListener: {
            event: 'click',
            funct: () => {
              btn_del.remove();
              btn_save.remove();
              upload_document(_xyz, documentControl.record, entry, doc, dataURL);
            }
          }
        });

      };

    };



  });

};