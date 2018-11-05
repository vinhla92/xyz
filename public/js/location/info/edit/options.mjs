import _xyz from '../../../_xyz.mjs';

import valChange from './valChange.mjs';

export default (record, entry) => {

  // Add undefined/other to the options array.
  entry.options.unshift('undefined');
  entry.options.push('other');

  // _xyz.utils.dropdown({
  //     appendTo: val,
  //     entries: entry.options,
  //     selected: entry.value,
  //     onchange: e => {
  //         e.target.classList.add('changed');
  //         record.upload.style.display = 'block';
  //         entry.value = e.target.options[e.target.value].textContent;
  //         entry.value = e.target[e.target.value].label;
  //     }
  // });

  // Create select prime element.
  let select = _xyz.utils.createElement({
    tag: 'select',
    appendTo: val,
    eventListener: {
      event: 'change',
      funct: e => {
        e.target.classList.add('changed');
        record.upload.style.display = 'block';
        entry.value = e.target.options[e.target.value].textContent;
        entry.value = e.target[e.target.value].label;
      }
    }
  });

  // Create options with dataset list of sub options and append to select prime.
  Object.keys(entry.options).map(function (i) {

    let opt = _xyz.utils.createElement({
      tag: 'option',
      options: {
        textContent: String(entry.options[i]).split(';')[0],
        value: i,
        selected: (String(entry.options[i]).split(';')[0] == entry.value)
      },
      appendTo: select
    });

    opt.dataset.list = String(entry.options[i]).split(';').slice(1).join(';');
  });

  // Create select_input which holds the value of the select prime option.
  let select_input = _xyz.utils.createElement({
    tag: 'input',
    options: {
      value: entry.value,
      type: 'text'
    },
    style: {
      display: 'none' // This element should only be displayed when select prime is 'other'.
    },
    eventListener: {
      event: 'keyup',
      funct: e => {
        e.target.classList.add('changed');
        record.upload.style.display = 'block';
        entry.value = e.target.value;
      }
    },
    appendTo: val
  });

  // Check whether value exists but not found in list.
  checkValueExists(select, select_input, entry);

  // Select sub condition on subfield exists.
  let subselect, subselect_input;

  if (entry.subfield) {
    
    // Create a new table row for select sub label
    tr = _xyz.utils.createElement({ tag: 'tr', appendTo: table });

    // Add select sub label to new tabel row.
    _xyz.utils.createElement({
      tag: 'td',
      options: {
        className: 'label lv-' + (entry.level || 0),
        textContent: entry.sublabel
      },
      appendTo: tr
    });

    // Create a new table row for select sub element.
    tr = _xyz.utils.createElement({ tag: 'tr', appendTo: table });

    // Create new td with subselect element and add to current table row.
    let td = _xyz.utils.createElement({
      tag: 'td',
      options: {
        className: 'val',
        colSpan: '2'
      },
      appendTo: tr
    });

    subselect = _xyz.utils.createElement({
      tag: 'select',
      eventListener: {
        event: 'change',
        funct: e => {

          // Show select input only for last select option (other).
          toggleSelectVisible(e.target, subselect_input, entry, 'subvalue');
          e.target.classList.add('changed');
          record.upload.style.display = 'block';
          entry.subvalue = subselect_input.value;
        }
      },
      appendTo: td
    });

    // Create options for current data-list and append to subselect element.
    let suboptions = String(select.options[select.selectedIndex].dataset.list).split(';');

    suboptions.unshift('undefined');

    // Remove last option if empty.
    if (suboptions[1] == '') suboptions.pop();

    suboptions.push('other');

    Object.keys(suboptions).map(function (i) {
      _xyz.utils.createElement({
        tag: 'option',
        options: {
          textContent: suboptions[i],
          value: i,
          selected: (suboptions[i] == entry.subvalue)
        },
        appendTo: subselect
      });
    });

    // Create select_input which holds the value of the select prime option.
    subselect_input = _xyz.utils.createElement({
      tag: 'input',
      options: {
        value: entry.subvalue,
        type: 'text'
      },
      style: {
        display: 'none' // This element should only be displayed when subselect is 'other'.
      },
      eventListener: {
        event: 'keyup',
        funct: e => {
          e.target.classList.add('changed');
          record.upload.style.display = 'block';
          entry.subvalue = e.target.value;
        }
      },
      eventListener: {
        event: 'change',
        funct: e => {
          e.target.classList.add('changed');
          record.upload.style.display = 'block';
          entry.subvalue = e.target.options[e.target.value].textContent;
          subselect_input.value = e.target.options[e.target.value].textContent;

          toggleSelectVisible(subselect, e.target, entry, 'subvalue');
        }
      },
      appendTo: td
    });

    checkValueExists(subselect, subselect_input, entry, 'subvalue');
  }

  select.addEventListener('change', e => {

    toggleSelectVisible(select, select_input, entry);

    // Clear subselect and add suboptions from select option dataset list.
    let suboptions = String(select.options[select.selectedIndex].dataset.list).split(';');
    suboptions.unshift('undefined');

    if (suboptions.length > 1 && subselect) {

      // Remove last option if empty.
      if (suboptions[1] == '') suboptions.pop();
      suboptions.push('other');
      subselect.innerHTML = '';

      Object.keys(suboptions).map(function (i) {
        _xyz.utils.createElement({
          tag: 'option',
          options: {
            textContent: suboptions[i],
            value: i,
            selected: (suboptions[i] == entry.subvalue)
          },
          appendTo: subselect
        });
      });

      // Check whether value exists but not found in list.
      checkValueExists(select, select_input, entry, 'subvalue');
    }

    // Add changed class and make cloud save visible.
    e.target.classList.add('changed');
    record.upload.style.display = 'block';
    entry.value = e.target[e.target.value].label;
  });

};

// Check whether value exists but not found in list.
function checkValueExists(sel, inp, entry, prop) {

  if (!sel || !inp) return;

  if (!prop) prop = 'value';

  if (sel.selectedIndex == 0 && entry[prop] && entry[prop] != 'undefined') sel.selectedIndex = sel.options.length - 1;

  if (sel.selectedIndex == sel.options.length - 1) inp.style.display = 'block';
  
}

// Show select input only for last select option (other).
function toggleSelectVisible(sel, inp, entry, prop) {

  if (!sel || !inp) return;

  if (!prop) prop = 'value';
  
  if (sel.selectedIndex == sel.options.length - 1) {
    inp.value = entry[prop];
    inp.style.display = 'block';

  } else {
    inp.value = sel[sel.value].label;
    inp.style.display = 'none';
  }
  
}