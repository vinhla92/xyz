import add_document from './add_document.mjs';

import delete_document from './delete_document.mjs';

export default (_xyz, record, entry) => {

  const docs = entry.value ? entry.value.reverse() : [];

  if (!docs.length && !entry.edit) return entry.row.remove();

  if (entry.label) entry.row = _xyz.utils.createElement({
    tag: 'tr',
    options: {
      className: 'lv-0'
    },
    appendTo: record.table
  });

  // Create a table cell for document control.
  entry.val = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'val',
      colSpan: '2'
    },
    style: {
      position: 'relative',
      height: '80px'
    },
    appendTo: entry.row
  });

  const documentControl = {};

  documentControl.record = record;

  // Create a container for document control.
  documentControl.container = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'doc-container'
    },
    appendTo: entry.val
  });

  // Create a table row to hold document array.
  documentControl.row = _xyz.utils.createElement({
  	tag: 'tr',
  	appendTo: documentControl.container
  });

  if (entry.edit) add_document(_xyz, documentControl, record, entry);

  // add images if there are any
  for (let doc of docs) {

  	const docRow = _xyz.utils.createElement({
  		tag: 'tr',
  		appendTo: documentControl.row
  	});
  	
  	const docCell = _xyz.utils.createElement({
  		tag: 'td',
  		appendTo: docRow//documentControl.row
  	});

  	const _doc = _xyz.utils.createElement({
	   	tag: 'a', // what tag?
	   	options: {
	   		id: doc.replace(/.*\//, '').replace(/\.([\w-]{3})/, ''),
	   		href: doc,
	   		textContent: doc.split('/').pop(),
	   		target: '_blank'
	   	},
	   	style: {
	   		border: '3px solid #EEE'
	   	},
	   	appendTo: docCell
    });

    // Add delete button if doc entry is editable.
    if (entry.edit) _xyz.utils.createElement({
      tag: 'span',
      options: {
        title: 'Delete document',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">clear</i>'
      },
      appendTo: docCell,
      eventListener: {
        event: 'click',
        funct: e => {
          e.target.remove();
          delete_document(_xyz, record, entry, _doc);
        }
      }
    });
  }

};