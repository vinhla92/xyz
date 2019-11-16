import search from './search.mjs';

import select from './select.mjs';

import createFeature from './createFeature.mjs';

export default _xyz => {

  const gazetteer = {

    init: init,

    search: search(_xyz),

    select: select(_xyz),

    createFeature: createFeature(_xyz),

    icon: {
      type: 'markerColor',
      colorMarker: '#64dd17',
      colorDot: '#33691e',
      anchor: [0.5, 1],
      scale: 0.05,
    },

  };

  return gazetteer;

  function init(params) {

    if (!params) return;

    Object.assign(gazetteer, params);

    // Results
    gazetteer.result = gazetteer.group.querySelector('ul');

    // Input
    gazetteer.input = gazetteer.group.querySelector('input');

    gazetteer.input.placeholder = _xyz.workspace.locale.gazetteer.placeholder || '';

    // Initiate search on keyup with input value
    gazetteer.input.addEventListener('keyup', e => {

      const keyset = new Set([37, 38, 39, 40, 13]);

      if (
        !keyset.has(e.keyCode || e.charCode) &&
        e.target.value.length > 0) gazetteer.search(e.target.value);

    });

    // Keydown events
    gazetteer.input.addEventListener('keydown', e => {

      const key = e.keyCode || e.charCode;

      // Cancel search and set results to empty on backspace or delete keydown
      if (key === 46 || key === 8) {
        if (gazetteer.xhr) gazetteer.xhr.abort();
        gazetteer.clear();
        if (gazetteer.layer) _xyz.map.removeLayer(gazetteer.layer);
        return;
      }

      // Select first result on enter keypress
      if (key === 13) {

        // Get possible coordinates from input and draw location if valid
        let latlng = e.target.value.split(',').map(parseFloat);
        if ((latlng[1] > -90 && latlng[1] < 90) && (latlng[0] > -180 && latlng[0] < 180)) {
          if (gazetteer.xhr) gazetteer.xhr.abort();
          gazetteer.clear();
          gazetteer.createFeature({
            type: 'Point',
            coordinates: [latlng[1], latlng[0]]
          });
        }

        gazetteer.result.querySelector('li').click();
      }
    });

    // Cancel search and empty results on input focusout
    gazetteer.input.addEventListener('focusout', () => {
      if (gazetteer.xhr) gazetteer.xhr.abort();
      setTimeout(gazetteer.clear, 400);
    });

    gazetteer.clear = () => {
      gazetteer.group.classList.remove('active');
      gazetteer.result.innerHTML = '';
    }

  };

};