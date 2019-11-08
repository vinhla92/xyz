import layer from './layer.mjs';

import view from './view/_view.mjs';

import listview from './listview.mjs';

export default _xyz => ({

  layer: layer(_xyz),

  list: {},

  view: view(_xyz),

  listview: listview(_xyz),

});