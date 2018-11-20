import _xyz from '../../../_xyz.mjs';

import valChange from './valChange.mjs';

import datepicker from 'js-datepicker';

import { createElement } from '../../../utils/createElement.mjs';

export default (record, entry) => {

  if(entry.type === 'datetime') entry.value = formatDateTime(entry.value);
  if(entry.type === 'date') entry.value = formatDate(entry.value);

  let input = createElement({
    tag: 'input',
    options: {
      value: entry.value || '',
      type: 'text'
    },
    appendTo: entry.val,
    eventListener: {
      event: 'focus',
      funct: e => { 
        translateDatePicker(e.target, true); 
      }
    }
  });
  pickDate(input, record, entry);
};

export function formatDate(unix_timestamp){

  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let d = new Date(unix_timestamp*1000),
    year = d.getFullYear(),
    month = months[d.getMonth()],
    day = d.getDate(),
    weekday = days[d.getDay()];
  return `${weekday} ${day} ${month} ${year}`;
}

export function formatDateTime(unix_timestamp){
  let dateStr = formatDate(unix_timestamp),
    d = new Date(unix_timestamp*1000);

  let h = d.getHours(),
    min = '0' + d.getMinutes(),
    sec = '0' + d.getSeconds();

  return `${dateStr}, ${h}:${min.substr(-2)}:${sec.substr(-2)}`;
}

export function meltDateStr(str){ // from beautiful string to bigint format
  return Math.round((new Date(str)).getTime() / 1000);
}

export function pickDate(element, record, entry, callback){

  return datepicker(element, {
    //position: 'tl',
    position: 'c',
    formatter: function(el, date, instance) {
        
      let _d = meltDateStr(new Date(date)), dateStr;
        
      if(entry.type === 'date') dateStr = formatDate(_d);
      if(entry.type === 'datetime') dateStr = formatDateTime(_d);

      el.value = dateStr;
    },
    onSelect: function(el, date, instance){
      if(callback){
        callback();
      } else {
        entry.val = meltDateStr(date);
        valChange(element, record, entry); 
      }
    },
    onShow: function(instance){}
  });
}

export function translateDatePicker(container, bottom){
  let instances = document.querySelectorAll('.qs-datepicker');
  
  let  yPosition = container.getBoundingClientRect().top;

  bottom ? instances.forEach(instance => {instance.style.top = (yPosition - 150) + 'px';}) : instances.forEach(instance => {instance.style.top = yPosition + 'px';});

}

