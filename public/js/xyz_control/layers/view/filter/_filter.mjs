import panel from './panel.mjs';

import filter_text from './filter_text.mjs';

import filter_numeric from './filter_numeric.mjs';

import filter_in from './filter_in.mjs';

import filter_date from './filter_date.mjs';

import filter_boolean from './filter_boolean.mjs';

export default _xyz => ({

  panel: panel(_xyz),

  filter_text: filter_text(_xyz),

  filter_numeric: filter_numeric(_xyz),

  filter_in: filter_in(_xyz),

  filter_date: filter_date(_xyz),

  filter_boolean: filter_boolean(_xyz),

});