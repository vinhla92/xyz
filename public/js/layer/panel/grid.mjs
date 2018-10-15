import _xyz from '../../_xyz.mjs';

import d3_selection from 'd3-selection';

export default layer => {

  const panel = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'panel report-block'
    },
    appendTo: layer.dashboard
  });

  // Create grid_seize dropdown.
  layer.grid_size = _xyz.hooks.current['grid_size'] || layer.grid_size || Object.keys(layer.queryFields[0])[0];
  _xyz.utils.dropdown({
    appendTo: panel,
    entries: layer.queryFields,
    selected: layer.grid_size,
    onchange: e => {
      layer.grid_size = e.target.value;
      _xyz.hooks.set('grid_size', layer.grid_size);
      layer.get();
    }
  });

  // Create a D3 svg for the legend and nest between size and color drop down.
  let
    width = layer.drawer.clientWidth,
    legend = d3_selection.select(panel).append('svg').attr('width', width);

  // Create grid_color dropdown.
  layer.grid_color = _xyz.hooks.current['grid_color'] || layer.grid_color || Object.keys(layer.queryFields[1])[0];
  _xyz.utils.dropdown({
    appendTo: panel,
    entries: layer.queryFields,
    selected: layer.grid_color,
    onchange: e => {
      layer.grid_color = e.target.value;
      _xyz.hooks.set('grid_color', layer.grid_color);
      layer.get();
    }
  });

  // Create grid_ratio checkbox.
  layer.grid_ratio = layer.grid_ratio || _xyz.hooks.current.grid_ratio || false;
  _xyz.utils.checkbox({
    label: 'Display colour values as a ratio to the size value.',
    checked: layer.grid_ratio || _xyz.hooks.current.grid_ratio,
    appendTo: panel,
    onChange: e => {

      // Set the layer grid ratio to the state of the checkbox.
      layer.grid_ratio = e.target.checked;

      // Set grid_ratio hook if true.
      layer.grid_ratio ?
        _xyz.hooks.set('grid_ratio', true) :
        _xyz.hooks.remove('grid_ratio');

      layer.get();
    }
  });

  // __defaults
  if (!layer.style) layer.style = {};

  if (!layer.style.range) layer.style.range = [
    '#15773f',
    '#66bd63',
    '#a6d96a',
    '#d9ef8b',
    '#fdae61',
    '#f46d43',
    '#d73027'
  ];

  // Create SVG grid legend
  let
    yTrack = 35,
    padding = 0,
    _width = width - (2 * padding),
    n = layer.style.range.length;

  for (let i = 0; i < n; i++) {

    let r = (i + 2) * 10 / n,
      w = _width / n,
      x = padding + (i * w);

    legend.append('circle')
      .attr('cx', x + w / 2 + 1)
      .attr('cy', yTrack + 1)
      .attr('r', r)
      .style('fill', '#333');

    legend.append('circle')
      .attr('cx', x + w / 2)
      .attr('cy', yTrack)
      .attr('r', r)
      .style('fill', '#999');

    if (i === 0) legend.append('text')
      .attr('x', x)
      .attr('y', yTrack - 20)
      .style('font-size', 13)
      .attr('text-anchor', 'start')
      .style('font-family', '"PT Mono", monospace')
      .attr('id', 'grid_legend_size__min')
      .text('min')
      .attr('id', 'grid_legend_size__min');

    if (i === (n / 2 % 1 != 0 && Math.round(n / 2) - 1)) legend.append('text')
      .attr('x', x + w / 2)
      .attr('y', yTrack - 20)
      .style('font-size', 13)
      .attr('text-anchor', 'middle')
      .style('font-family', '"PT Mono", monospace')
      .text('avg')
      .attr('id', 'grid_legend_size__avg');

    if (i === n - 1) legend.append('text')
      .attr('x', x + w)
      .attr('y', yTrack - 20)
      .style('font-size', 13)
      .attr('text-anchor', 'end')
      .style('font-family', '"PT Mono", monospace')
      .text('max')
      .attr('id', 'grid_legend_size__max');
  }

  yTrack += 20;

  for (let i = 0; i < n; i++) {

    let w = _width / n,
      x = padding + i * w;

    legend.append('rect')
      .attr('x', x)
      .attr('y', yTrack)
      .attr('width', w)
      .attr('height', 20)
      .style('fill', layer.style.range[i]);

    if (i === 0) legend.append('text')
      .attr('x', x)
      .attr('y', yTrack + 40)
      .style('font-size', 13)
      .attr('text-anchor', 'start')
      .style('font-family', '"PT Mono", monospace')
      .attr('id', 'grid_legend_color__min')
      .text('min');

    if (i === (n / 2 % 1 != 0 && Math.round(n / 2) - 1)) legend.append('text')
      .attr('x', x + w / 2)
      .attr('y', yTrack + 40)
      .style('font-size', 13)
      .attr('text-anchor', 'middle')
      .style('font-family', '"PT Mono", monospace')
      .attr('id', 'grid_legend_color__avg')
      .text('avg');

    if (i === n - 1) legend.append('text')
      .attr('x', x + w)
      .attr('y', yTrack + 40)
      .style('font-size', 13)
      .attr('text-anchor', 'end')
      .style('font-family', '"PT Mono", monospace')
      .attr('id', 'grid_legend_color__max')
      .text('max');
  }

  legend.attr('height', yTrack + 43);
};