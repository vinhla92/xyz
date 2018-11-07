import _xyz from '../../../_xyz.mjs';

import valChange from './valChange.mjs';
import datepicker from 'js-datepicker';

export default (record, entry) => {

  console.log(record);
  //console.log(entry);
  
   if(entry.type === 'datetime'){
     entry.value = formatDateTime(entry.value); 
     return;
    }
    
    if(entry.type === 'date'){
      entry.value = formatDate(entry.value);
      console.log(entry.value);
      return;
    }

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

export function pickDate(record, entry){
  /*const picker = datepicker(document.querySelector('#date'), {
    formatter: function(el, date, instance) {
        
        let _d = new Date(date);
        
        let dd = _d.getDate();
        let mm = _d.getMonth()+1; 
        let yyyy = _d.getFullYear();
        
        if(dd<10) 
        { dd=`0${dd}`; } 
        if(mm<10) { mm=`0${mm}`; } 
        
        let dateStr = `${dd}/${mm}/${yyyy}`;
        
        //document.querySelector("#test").textContent = dateStr;
        
        el.value = dateStr;
      },
      onSelect: function(el, date, instance){
      document.querySelector('.clear').classList.add('show');
      }
    });*/
}