import Chart from 'chart.js';
import {createElement} from '../../utils/createElement.mjs';
import {camelize} from '../../utils/camelize.mjs';

export default (group) => {

  let chart_id = 'chart_' + camelize(group.label);

  var canvas = createElement({
    tag: 'canvas',
    options: {
      id: chart_id
    }
  });

  //console.log(group);
  //console.log(JSON.stringify(group));

  let labels = group.fields.map(field => {return field.label}),
      data = group.fields.map(field => {return field.value}),
      
      _chart = new Chart(chart_id, {
        type: group.chart.type || 'line',
        data: {
          labels: labels,
          datasets: [{
            label: group.label,
                backgroundColor: group.chart.backgroundColor || '#cf9',
                borderColor: group.chart.borderColor || '#079e00',
                data: data
            }]
        },
        options: {
            responsive: true
        }
    });
    //return canvas;
    console.log(canvas);
};