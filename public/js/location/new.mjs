import _xyz from '../_xyz.mjs';

import * as controls from './controls.mjs';

export default record => {

  _xyz.locations.dom.parentElement.style.display = 'block';

  Object.values(_xyz.locations.dom.children).forEach(el => el.classList.remove('expanded'));

  // Create drawer element to contain the header with controls and the infoj table with inputs.
  record.drawer = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'drawer expandable expanded'
    }
  });

  // Create the header element to contain the control elements
  record.header = _xyz.utils.createElement({
    tag: 'div',
    options: {
      textContent: record.letter,
      className: 'header pane_shadow'
    },
    style: {
      borderBottom: '2px solid ' + record.color
    },
    appendTo: record.drawer,
    eventListener: {
      event: 'click',
      funct: () => {
        _xyz.utils.toggleExpanderParent({
          expandable: record.drawer,
          accordeon: true,
          scrolly: document.querySelector('.mod_container > .scrolly')
        });
      }
    }
  });

  // Create the clear control element to control the removal of a feature from the select.layers.
  controls.clear(record);
        
  // Create control to save new item to database.
  controls.update(record);

  // Add header element to the drawer.
  record.drawer.appendChild(record.header);

  // Find free space and insert record.
  let idx = _xyz.locations.list.indexOf(record);
  _xyz.locations.dom.insertBefore(record.drawer, _xyz.locations.dom.children[idx]);

  if (_xyz.view.mode === 'desktop') setTimeout(() => {
    let el = document.querySelector('.mod_container > .scrolly');
    el.scrollTop = el.clientHeight;
  }, 500);

  // Make select tab active on mobile device.
  if (_xyz.view.mobile) _xyz.view.mobile.activateLocationsTab();

};