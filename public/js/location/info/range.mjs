import _xyz from '../../_xyz.mjs';

export default (table, val, entry, record) => {

  val.textContent = entry.value || entry.value == 0 ? parseInt(entry.value) : entry.range[0];

  const tr = _xyz.utils.createElement({ 
    tag: 'tr',
    appendTo: table
  });

  const range = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'range',
      colSpan: '2'
    },
    appendTo: tr
  });

  _xyz.utils.createElement({
    tag: 'input',
    options: {
      value: entry.value || entry.value == 0 ? parseInt(entry.value) : entry.range[0],
      type: 'range',
      min: entry.range[0],
      max: entry.range[1]
    },
    style: {
      width: 'calc(100% - 10px)'
    },
    eventListener: {
      event: 'input',
      funct: e => {
        val.classList.add('changed');
        val.textContent = e.target.value;
        record.upload.style.display = 'block';
        entry.value = e.target.value;
      }
    },
    appendTo: range
  });

};