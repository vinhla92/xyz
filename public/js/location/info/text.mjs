import _xyz from '../../_xyz.mjs';

export default (val, entry, record) => {

  _xyz.utils.createElement({
    tag: 'textarea',
    options: {
      value: entry.value || '',
      rows: 5
    },
    appendTo: val,
    eventListener: {
      event: 'keyup',
      funct: e => {
        e.target.classList.add('changed');
        record.upload.style.display = 'block';
        entry.value = e.target.value;
      }
    }
  });

};