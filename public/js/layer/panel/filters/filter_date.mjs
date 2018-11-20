import _xyz from '../../../_xyz.mjs';

import create_block from './create_block.mjs';
import { createElement } from '../../../utils/createElement.mjs';
import { paramString } from '../../../utils/paramString.mjs';
import { pickDate, meltDateStr, translateDatePicker } from '../../../location/info/edit/date.mjs';

export default (layer, filter_entry) => {

  const block = create_block(layer, filter_entry);

  // Label for min / greater then control.
  createElement({
    tag: 'div',
    options: {
      classList: 'range-label',
      textContent: 'After ',
    },
    appendTo: block
  });

  const input_min = createElement({
    tag: 'input',
    options: {
      classList: 'range-input',
      type: 'text'
    },
    appendTo: block,
    eventListener: {
      event: 'click',
      funct: e => { 
        //let to;
        setTimeout(function(){
          //translateDatePicker(e.target); 
        }, 500);
      }
    }
    
  });

  createElement({
    tag: 'div',
    appendTo: block,
    style: {
      width: '100%',
      height: '10px'
    }
  });

  createElement({
    tag: 'div',
    options: {
      classList: 'range-label',
      textContent: 'Before ',
    },
    appendTo: block
  });

  const input_max = createElement({
    tag: 'input',
    options: {
      classList: 'range-input',
      type: 'text'
    },
    appendTo: block
  });

  function mycallback(){ applyFilter(); console.log('date picked'); };

  pickDate(input_min, layer, filter_entry, mycallback);
  pickDate(input_max, layer, filter_entry, mycallback);

  let timeout;

  function applyFilter(){

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;

      // Create filter.
      layer.filter.current[filter_entry.field] = {};
      layer.filter.current[filter_entry.field].gt = parseFloat(meltDateStr(input_min.value));
      layer.filter.current[filter_entry.field].lt = parseFloat(meltDateStr(input_max.value));

      console.log(layer.filter);

      // Reload layer.
      //layer.get();

    }, 500);
  }

  /*const xhr = new XMLHttpRequest();

  xhr.open('GET', _xyz.host + '/api/location/field/range?' + paramString({
    locale: _xyz.locale,
    layer: layer.key,
    table: layer.table,
    field: filter_entry.field,
    token: _xyz.token
  }));

  xhr.onload = e => {

    console.log('date filter onload');

    const field_range = JSON.parse(e.target.response);

    const block = create_block(layer, filter_entry);
  
    // Label for min / greater then control.
    createElement({
      tag: 'div',
      options: {
        classList: 'range-label',
        textContent: 'After ',
      },
      appendTo: block
    });
  
    const input_min = createElement({
      tag: 'input',
      options: {
        classList: 'range-input',
        type: 'date',
        min: field_range.min,
        max: field_range.max,
        value: field_range.min
      },
      appendTo: block,
      eventListener: {
        event: 'keyup',
        funct: e => {
    
          // Set slider value and apply filter.
          //slider_min.value = e.target.value;
          applyFilter();
        }
      }
    });

    createElement({
      tag: 'div',
      appendTo: block,
      style: {
        width: '100%',
        height: '10px'
      }
    });
  
    // const slider_min = _xyz.utils.slider({
    //   min: field_range.min,
    //   max: field_range.max,
    //   value: field_range.min,
    //   appendTo: block,
    //   oninput: e => {
  
    //     // Set input value and apply filter.
    //     input_min.value = e.target.value;
    //     applyFilter();
    //   }
    // });
  
    // Label for max / smaller then control.
    createElement({
      tag: 'div',
      options: {
        classList: 'range-label',
        textContent: 'Before '
      },
      appendTo: block
    });
  
    const input_max = createElement({
      tag: 'input',
      options: {
        classList: 'range-input',
        type: 'date',
        min: field_range.min,
        max: field_range.max,
        value: field_range.max
      },
      appendTo: block,
      eventListener: {
        event: 'keyup',
        funct: e => {

          // Set slider value and apply filter.
          //slider_max.value = e.target.value;
          applyFilter();
        }
      }
    });
  
    // const slider_max = _xyz.utils.slider({
    //   min: field_range.min,
    //   max: field_range.max,
    //   value: field_range.max,
    //   appendTo: block,
    //   oninput: e => {
  
    //     // Set input value and apply filter.
    //     input_max.value = e.target.value;
    //     applyFilter();
    //   }
    // });

    // Apply max value after the slider has been created.
    //slider_max.value = field_range.max;


    // Use timeout to debounce applyFilter from multiple and slider inputs.
    



  xhr.send(); */
};

function legacy() {

  // default date strings
  let def = {
    dd: '01',
    mm: '01',
    df: []
  };
    
  def.df[1] = def.mm;
  def.df[2] = def.dd;
    
  function date_to_string(arr) {
    return '\'' + arr.join('-') + '\'';
  }
    
  function show_reset() {
    let siblings = options.appendTo.children;
    for (let sibling of siblings) {
      if (sibling.tagName === 'DIV' && sibling.classList.contains('btn_small')) {
        sibling.style.display = 'block';
      }
    }
  }
    
  // sql and keyups
    
  function onkeyup(e, format) {
    let val = parseInt(e.target.value);
    if (e.target.value) show_reset();
    
    switch (format) {
    case 'dd':
      if (val && val > 0 && val < 32) {
        if (val < 10) val = '0' + String(val);
        def.df[2] = val;
        if (def.df[0]) layer.filter.current[options.field][e.target.name] = date_to_string(def.df);
      } else {
        def.df[2] = def[format];
      } break;
    
    case 'mm':
      if (val && val > 0 && val < 13) {
        if (val < 10) val = '0' + String(val);
        def.df[1] = val;
        if (def.df[0]) layer.filter.current[options.field][e.target.name] = date_to_string(def.df);
      } else {
        def.df[1] = def[format];
      } break;
    
    case 'yyyy':
      if (!layer.filter.current[options.field]) layer.filter.current[options.field] = {};
      if (val && val > 99) {
        def.df[0] = val;
        layer.filter.current[options.field][e.target.name] = date_to_string(def.df);
      } else {
        def.df[0] = null;
        layer.filter[options.field] = {};
      } break;
    }
    layer.get();
  }
    
  // labels
  // later than label
  createElement({
    tag: 'div',
    options: {
      classList: 'label half',
      textContent: 'later than'
    },
    appendTo: options.appendTo
  });
    
  // earlier than label
  createElement({
    tag: 'div',
    options: {
      classList: 'label half right',
      textContent: 'earlier than'
    },
    appendTo: options.appendTo
  });
    
  // later than year input
  createElement({
    tag: 'input',
    options: {
      classList: 'label third',
      placeholder: 'yyyy',
      name: 'gte'
    },
    eventListener: {
      event: 'keyup',
      funct: e => onkeyup(e, 'yyyy')
    },
    appendTo: options.appendTo
  });
    
  // later than month input
  createElement({
    tag: 'input',
    options: {
      classList: 'label third',
      placeholder: 'mm'
    },
    eventListener: {
      event: 'keyup',
      funct: e => onkeyup(e, 'mm')
    },
    appendTo: options.appendTo
  });
    
  // later than day input
  createElement({
    tag: 'input',
    options: {
      classList: 'label third',
      placeholder: 'dd'
    },
    eventListener: {
      event: 'keyup',
      funct: e => onkeyup(e, 'dd')
    },
    appendTo: options.appendTo
  });
    
  // earlier than day input
  createElement({
    tag: 'input',
    options: {
      classList: 'label third right',
      placeholder: 'dd'
    },
    eventListener: {
      event: 'keyup',
      funct: e => onkeyup(e, 'dd')
    },
    appendTo: options.appendTo
  });
    
  // earlier than month input
  createElement({
    tag: 'input',
    options: {
      classList: 'label third right',
      placeholder: 'mm'
    },
    eventListener: {
      event: 'keyup',
      funct: e => onkeyup(e, 'mm')
    },
    appendTo: options.appendTo
  });
    
  // earlier than year input
  createElement({
    tag: 'input',
    options: {
      classList: 'label third right',
      placeholder: 'yyyy',
      name: 'lte'
    },
    eventListener: {
      event: 'keyup',
      funct: e => onkeyup(e, 'yyyy')
    },
    appendTo: options.appendTo
  });
    
  createElement({
    tag: 'div',
    options: {
      classList: 'btn_small cursor noselect',
      textContent: 'Reset'
    },
    eventListener: {
      event: 'click',
      funct: e => {
        let siblings = options.appendTo.children;
        for (let sibling of siblings) {
          if (sibling.tagName === 'INPUT') sibling.value = '';
        }
        e.target.style.display = 'none';
        layer.filter.current[options.field] = {};
        layer.get();
      }
    },
    appendTo: options.appendTo
  });

}