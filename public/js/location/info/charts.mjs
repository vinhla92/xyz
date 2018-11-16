import Chart from 'chart.js';
import {createElement} from '../../utils/createElement.mjs';

export default (group) => {

  let div = createElement({tag: 'div', style: {position: 'relative'}});

  let canvas = createElement({
    tag: 'canvas',
    appendTo: div
  });

  let labels = group.fields.map(field => {return field.label;}),
    data = group.fields.map(field => {return field.value;}),
      
    _chart = new Chart(canvas, {
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
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                callback: (label, index, labels) => {
                  return label/1000 + 'k';
                }
              },
              scaleLabel: {
                display: true,
                labelString: '1k = 1000'
              }
            }
          ]
        }
      }
    });
  return div;
};