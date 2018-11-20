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

export function formatDate(str){

  let d = new Date(str),
    options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
    loc = 'en-GB';

  return d ? d.toLocaleDateString(loc, options) : false;
}

export function formatDateTime(str){
  let d = new Date(str),
    options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
    loc = 'en-GB';
  return d ? d.toLocaleDateString(loc, options) + ', ' + d.toLocaleTimeString(loc) : false;
}

export function meltDateStr(str){ // from beautiful string to sql-date format
  let _d = new Date(str),
    dd = _d.getDate(),
    mm = _d.getMonth()+1,
    yyyy = _d.getFullYear();
  
  if(dd<10) 
  { dd=`0${dd}`; } 
  if(mm<10) { mm=`0${mm}`; } 
  
  return `${yyyy}-${mm}-${dd}`;
}

export function pickDate(element, record, entry, callback){

  return datepicker(element, {
    //position: 'tl',
    position: 'c',
    formatter: function(el, date, instance) {
        
      let _d = new Date(date), dateStr;
        
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

