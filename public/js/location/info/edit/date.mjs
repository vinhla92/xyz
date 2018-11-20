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
    appendTo: entry.val
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

      //instance.el.style.top = el.getBoundingClientRect().top + 'px';
        
    },
    onSelect: function(el, date, instance){
      if(callback){
        callback();
      } else {
        entry.val = meltDateStr(date);
        valChange(element, record, entry); 
      }
    },
    onShow: function(instance){
      //let yPosition = instance.el.parentNode.getBoundingClientRect().top;
      //instance.el.style.top = yPosition + 'px';
      //console.log(instance);
      //instance.el.style.display = 'block';
      //translateDatePicker(element, instance);
      /*console.log(instance);
      console.log(element.getBoundingClientRect());
      let xPosition = element.getBoundingClientRect().left - (instance.el.clientWidth / 2) + 200,
          yPosition = element.getBoundingClientRect().top - (instance.el.clientHeight / 2) + 400;
          
      instance.el.style.left = xPosition + "px";
      instance.el.style.top = yPosition + "px";
      //console.log({x: xPosition, y: yPosition});
      console.log(instance.el.style.left, instance.el.style.top);*/
    }
  });
}

export function translateDatePicker(container){
  let instance = document.querySelector('.qs-datepicker');
  
  //container.addEventListener("click", e => {
  //let xPosition = e.clientX - container.getBoundingClientRect().left - (instance.clientWidth / 2),
  //    yPosition = e.clientY - container.getBoundingClientRect().top - (instance.clientHeight / 2);
  // in case of a wide border, the boarder-width needs to be considered in the formula above
  let //xPosition = container.getBoundingClientRect().left, //- (instance.clientWidth / 2) + 20,
    yPosition = container.getBoundingClientRect().top; //+ (instance.clientHeight / 2);

    //instance.style.left = xPosition + "px";
  instance.style.top = yPosition + 'px';
  //});

}

