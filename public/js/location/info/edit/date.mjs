import _xyz from '../../../_xyz.mjs';

import valChange from './valChange.mjs';
import datepicker from 'js-datepicker';

export default (record, entry) => {

  console.log('default date');
  console.log(record);
  //console.log(entry);
  if(entry.type === 'datetime') entry.value = formatDateTime(entry.value);
  if(entry.type === 'date') entry.value = formatDate(entry.value);

  let input = _xyz.utils.createElement({
    tag: 'input',
    options: {
      value: entry.value || '',
      type: 'text'
    },
    appendTo: entry.val,
    eventListener: {
      event: 'click',
      funct: e => {
        //valChange(e.target, record, entry); // add date picker
      }
    }
  });

  pickDate(input, record, entry);

};

export function formatDate(str){
  console.log(str);
  let d = new Date(str),
    options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
    loc = 'en-GB';
    console.log(d);
  return d ? d.toLocaleDateString(loc, options) : false;
}

export function formatDateTime(str){
  let d = new Date(str),
    options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
    loc = 'en-GB';
  return d ? d.toLocaleDateString(loc, options) + ', ' + d.toLocaleTimeString(loc) : false;
}

export function pickDate(element, record, entry){
  datepicker(element, {
    formatter: function(el, date, instance) {
        
        let _d = new Date(date), dateStr;
        
        if(entry.type === 'date') dateStr = formatDate(_d);
        if(entry.type === 'datetime') dateStr = formatDateTime(_d);
        /*let dd = _d.getDate();
        let mm = _d.getMonth()+1; 
        let yyyy = _d.getFullYear();
        
        if(dd<10) 
        { dd=`0${dd}`; } 
        if(mm<10) { mm=`0${mm}`; } 
        
        let dateStr = `${dd}/${mm}/${yyyy}`;*/
        
        //document.querySelector("#test").textContent = dateStr;
        el.value = dateStr;
      },
      onSelect: function(el, date, instance){
        console.log('date selected');
        //valChange(el, record, entry); 
      //document.querySelector('.clear').classList.add('show');
      }
    });
}