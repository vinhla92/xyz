import panel from './panel.mjs';

import polyStyle from './polyStyle.mjs';

import clusterStyle from './clusterStyle.mjs';

import legend from './legend/_legend.mjs';

export default _xyz => ({

  panel: panel(_xyz),

  legend: legend(_xyz),

  polyStyle: polyStyle(_xyz),

  clusterStyle: clusterStyle(_xyz),

});