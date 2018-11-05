import _xyz from '../../../_xyz.mjs';

export default (record, entry) => {

  _xyz.utils.createElement({
    tag: 'span',
    options: {
      textContent: entry.range.label
    },
    appendTo: entry.val
  });

  const lbl = _xyz.utils.createElement({
    tag: 'span',
    options: {
      textContent: entry.value,
      className: 'bold'
    },
    appendTo: entry.val
  });

  _xyz.utils.slider({
    min: entry.range.min,
    max: entry.range.max,
    value: entry.value,
    appendTo: entry.val,
    oninput: e => {
      lbl.innerHTML = e.target.value;
    }
  });

};