import _xyz from '../../../_xyz.mjs';

export default (record, entry) => {

  if(entry.type === 'datetime') entry.value = _xyz.utils.formatDateTime(entry.value);

  if(entry.type === 'date') entry.value = _xyz.utils.formatDate(entry.value);

  const input = _xyz.utils.createElement({
    tag: 'input',
    options: {
      value: entry.value || '',
      type: 'text'
    },
    appendTo: entry.val,
    // eventListener: {
    //   event: 'focus',
    //   funct: e => { 
    //     _xyz.utils.translateDatePicker(e.target, true); 
    //   }
    // }
  });

  _xyz.utils.datePicker(input, record, entry);
};