import _xyz from '../../../_xyz.mjs';

import polyGraduated from './polyGraduated.mjs';

import polyCategorized from './polyCategorized.mjs';

import clusterCategorized from './clusterCategorized.mjs';

import clusterGraduated from './clusterGraduated.mjs';

import polyStyle from './polyStyle.mjs';

export default layer => {

  // Meaningful styles can only be set for vector and cluster objects.
  if (layer.format === 'grid' || layer.format === 'tiles') return;

  // Add style panel to layer dashboard.
  const panel = _xyz.utils.createElement({
    tag: 'div',
    options: {
      classList: 'panel expandable'
    },
    appendTo: layer.dashboard
  });

  // Style panel title / expander.
  _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'btn_text cursor noselect',
      textContent: 'Style'
    },
    appendTo: panel,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();

        _xyz.utils.toggleExpanderParent({
          expandable: panel,
          accordeon: true,
          scrolly: document.querySelector('.mod_container > .scrolly')
        });
      }
    }
  });

  // Create empty layer themes array if none exists.
  if (!layer.style.themes) layer.style.themes = [];

  // Set layer theme to be the theme defined in the workspace,
  // the first theme from an array or null.
  layer.style.theme = layer.style.theme || layer.style.themes[0];

  // Set themes array to the theme if array doesn't exist.
  if (!layer.style.themes) layer.style.themes = [layer.style.theme];

  // Push no theme entry into themes array.
  layer.style.themes.unshift({ label: 'No theme.' });

  // Create theme drop down
  const theme_select = _xyz.utils.dropdown({
    title: 'Select thematic style…',
    appendTo: panel,
    entries: layer.style.themes,
    label: 'label',
    onchange: e => {

      //clear any applied 'ni' filters when theme changes
      //if (layer.style.theme && layer.filter.legend[layer.style.theme.field] && layer.filter.legend[layer.style.theme.field].ni) layer.filter.legend[layer.style.theme.field].ni = [];

      layer.style.theme = layer.style.themes[e.target.selectedIndex];
      applyTheme(layer);
      
    }
  });

  layer.style.legend = _xyz.utils.createElement({
    tag: 'div',
    appendTo: panel,
  });

  applyTheme(layer);

  //layer.get();

};

function applyTheme(layer) {

  layer.style.legend.innerHTML = '';

  if (!layer.style.theme) {

    polyStyle(layer, layer.style.default, 'Polygon');

    polyStyle(layer, layer.style.highlight, 'Highlight');

    return;
  }

  if ((layer.format === 'mvt' || layer.format === 'geojson')
    && layer.style.theme.type === 'categorized') polyCategorized(layer);

  if ((layer.format === 'mvt' || layer.format === 'geojson')
    && layer.style.theme.type === 'graduated') polyGraduated(layer);

  if (layer.format === 'cluster'
    && layer.style.theme.type === 'categorized') clusterCategorized(layer);

  if (layer.format === 'cluster'
    && layer.style.theme.type === 'graduated') clusterGraduated(layer);

  //layer.get();

}