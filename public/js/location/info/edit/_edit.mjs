import _xyz from '../../../_xyz.mjs';

import range from './range.mjs';

import options from './options.mjs';

import date from './options.mjs';

import valChange from './valChange.mjs';

export default (record, entry) => {

  // Create a date control.
  if (entry.type === 'date') return date(record, entry);

  // Create range input for range fields.
  if (entry.range) return range(record, entry);

  // Create select input for options (and suboptions).
  if (entry.options) return options(record, entry);

  // Create a 3 line textarea for textarea type entry.
  if (entry.type === 'textarea') return _xyz.utils.createElement({
    tag: 'textarea',
    options: {
      value: entry.value || '',
      rows: 3
    },
    appendTo: entry.val,
    eventListener: {
      event: 'keyup',
      funct: e => valChange(e.target, record, entry)
    }
  });

  // Create a text input if no other rule applies.
  _xyz.utils.createElement({
    tag: 'input',
    options: {
      value: entry.value || '',
      type: 'text'
    },
    appendTo: entry.val,
    eventListener: {
      event: 'keyup',
      funct: e => valChange(e.target, record, entry)
    }
  });

};