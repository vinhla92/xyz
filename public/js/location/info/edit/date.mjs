import _xyz from '../../../_xyz.mjs';

import valChange from './valChange.mjs';

export default (record, entry) => {

  console.log(record);
  //console.log(entry);
  
   if(entry.type === 'datetime'){
     entry.value = formatDateTime(rows[0][entry.field]); 
     return;
    }
    
    if(entry.type === 'date'){
      entry.value = formatDate(rows[0][entry.field]);
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