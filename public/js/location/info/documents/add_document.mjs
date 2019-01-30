import upload_document from './upload_document.mjs';

export default (_xyz, imageControl, entry) => {

// Add table cell for image upload input.
  documentControl.add_doc_td = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'addDocCell'
    },
    appendTo: documentControl.row
  });


  // Add label for image upload icon.
  documentControl.add_doc_label = _xyz.utils.createElement({
    tag: 'label',
    options: {
      htmlFor: 'addDoc_' + documentControl.record.letter
    },
    appendTo: documentControl.add_doc_td
  });

  // Add image upload icon to label.
  _xyz.utils.createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect',
      textContent: 'attachment'
    },
    appendTo: imageControl.add_img_label
  });

};