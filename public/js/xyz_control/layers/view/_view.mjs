import create from './create.mjs'

import style from './style/_styles.mjs';

import filter from './filter/_filter.mjs';

import draw from './draw.mjs';

import cluster from './cluster.mjs';

import table from './table.mjs';

import report from './report.mjs';

export default _xyz => ({

  create: create(_xyz),

  style: style(_xyz),

  filter: filter(_xyz),

  draw: draw(_xyz),

});