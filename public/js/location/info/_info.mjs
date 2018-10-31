import _xyz from '../../_xyz.mjs';

import group from './group.mjs';

import streetview from './streetview.mjs';

import images from './images.mjs';

import range from './range.mjs';

import text from './text.mjs';

import options from './options.mjs';

export default record => {

  // Create infojTable table to be returned from this function.
  const table = _xyz.utils.createElement({
    tag: 'table',
    options: {
      className: 'infojTable'
    },
    style: {
      cellPadding: '0',
      cellSpacing: '0',
      borderBottom: '1px solid ' + record.color
    },
    appendTo: record.drawer
  });

  // Adds layer info to beginning of infoj array.
  record.location.infoj.unshift({
    'label': 'Layer',
    'value': _xyz.layers.list[record.location.layer].name,
    'type': 'text',
    'inline': true,
    'locked': true
  });

  // Adds group info to beginning of infoj array.
  if (_xyz.layers.list[record.location.layer].group) record.location.infoj.unshift({
    'label': 'Group',
    'value': _xyz.layers.list[record.location.layer].group,
    'type': 'text',
    'inline': true,
    'locked': true
  });

  record.location.infogroups = {};

  // Iterate through info fields and add to info table.
  Object.values(record.location.infoj).forEach(entry => {

    //create tr
    let tr = _xyz.utils.createElement({
      tag: 'tr',
      options: {
        className: 'lv-' + (entry.level || 0)
      },
      appendTo: table
    });

    if (entry.type === 'group') return group(record.location.infogroups, tr, entry);

    if (entry.group) {

      tr = _xyz.utils.createElement({
        tag: 'tr',
        options: {
          className: 'lv-' + (entry.level || 0)
        },
        appendTo: record.location.infogroups[entry.group].table
      });

    }

    // Create streetview control.
    if (entry.streetview) return streetview(table, record, tr);

    // Create new table cell for label and append to table.
    if (entry.label) {
      let label = _xyz.utils.createElement({
        tag: 'td',
        options: {
          className: 'label lv-' + (entry.level || 0),
          textContent: entry.label
        },
        appendTo: tr
      });

      // add tooltip text
      if (entry.title) label.title = entry.title;

      // return from object.map function if field(label) has no type.
      if (!entry.type) return;
    }

    // Remove row if not editable (or entry is locked) and entry has no value.
    if ((!record.location.edit || entry.locked) && !entry.value) return tr.remove();

    // Create new row for text cells and append to table.
    let val;

    if (
      entry.type
    && !entry.inline
    && !(
      entry.type === 'integer'
      || entry.type === 'numeric'
      || entry.type === 'date')) {

      tr = _xyz.utils.createElement({
        tag: 'tr',
        appendTo: table });

      val = _xyz.utils.createElement({
        tag: 'td',
        options: {
          className: 'val',
          colSpan: '2'
        },
        appendTo: tr
      });

    } else {

      val = _xyz.utils.createElement({
        tag: 'td',
        options: {
          className: 'val num'
        },
        appendTo: tr
      });

    }

    // If input is images create image control and return from object.map function.
    if (entry.images) return images(val, record, entry.value.reverse() || []);

    // Set field value if layer is not editable (or entry is locked) and return from object.map function.
    if ((!record.location.edit || entry.locked || entry.layer) && entry.value) {

      return val.textContent = entry.type === 'numeric' ?
        parseFloat(entry.value).toLocaleString('en-GB', { maximumFractionDigits: record.location.grid ? 0 : 2 }) : entry.type === 'integer' ?
          parseInt(entry.value).toLocaleString('en-GB', { maximumFractionDigits: 0 }) : entry.type === 'date' ?
            new Date(entry.value).toLocaleDateString('en-GB') : entry.value;

    }

    // Create range input for range fields.
    if (entry.range) return range(table, val, entry, record);

    // Create input text area for editable fields
    if (entry.text) return text(val, entry, record);

    // Create select input for options.
    if (entry.options) return options(val, entry, record);

    // Creat input for editable fields
    if (record.location.edit && !entry.locked && !entry.layer) {
      _xyz.utils.createElement({
        tag: 'input',
        options: {
          value: entry.value || '',
          type: 'text'
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
    }

  });
    
  // // hide empty sections.
  // let prev, next, len = table.children.length;
  
  // for (let i = 1; i < len; i++) {
  //   next = table.children[i];
  //   prev = table.children[i - 1];

  //   if (next && next.children && next.children.length == 1) {
  //     if (next.children[0].classList.contains('label') && prev.children[prev.children.length - 1].classList.contains('label')) {
  //       prev.children[prev.children.length - 1].style.display = 'none';
  //       if (i == len - 1) next.children[0].style.display = 'none';
  //     }
  //   }
  // }

};