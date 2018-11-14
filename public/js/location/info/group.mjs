import _xyz from '../../_xyz.mjs';

import chart from './charts.mjs';

import {createElement} from '../../utils/createElement.mjs';
import {toggleExpanderParent} from '../../utils/toggleExpanderParent.mjs';

export default (record, group) => {

  record.location.infogroups[group.label] = group;

  group.td = createElement({
    tag: 'td',
    options: {
      colSpan: '2'
    },
    appendTo: group.row
  });

  group.div = createElement({
    tag: 'div',
    options: {
      classList: 'table-section expandable'
    },
    appendTo: group.td
  });

  group.header = createElement({
    tag: 'div',
    options: {
      className: 'btn_subtext cursor noselect'
    },
    style: {
      textAlign: 'left',
      fontStyle: 'italic'
    },
    appendTo: group.div,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        toggleExpanderParent({
          expandable: group.div,
          accordeon: true,
          scrolly: document.querySelector('.mod_container > .scrolly')
        });
      }
    }
  });

  // Add label to group header.
  createElement({
    tag: 'span',
    options: {
      textContent: group.label
    },
    appendTo: group.header
  });

  // Add expander to group header.
  createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect btn_header t-expander',
      title: 'Show section'
    },
    appendTo: group.header,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        toggleExpanderParent({
          expandable: group.div,
          scrolly: document.querySelector('.mod_container > .scrolly')
        });
      }
    }
  });

  // Add chart control to group header.
  if (group.chart) createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect btn_header',
      title: 'Show graph',
      textContent: 'bar_chart'
    },
    appendTo: group.header,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        group.fields = record.location.infoj.filter(entry => entry.group === group.label);
        //chart(group);
       // group.table.appendChild(chart(group));
       chart(group);
      }
    }
  });

  group.table = createElement({
    tag: 'table',
    style: {
      cellPadding: '0',
      cellSpacing: '0',
      width: '95%',
      position: 'relative' // required for responsive chart
    },
    appendTo: group.div
  });

};