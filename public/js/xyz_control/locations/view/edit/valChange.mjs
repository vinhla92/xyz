export default (param) => {

  if(param.input.type === 'checkbox'){

    if(!!param.entry.value !== !!param.input.checked){
      
      param.entry.newValue = param.value || param.input.checked || 'false';
      param.input.parentNode.classList.add('primary-colour');
     
    } else {
      
      delete param.entry.newValue;
      param.input.parentNode.classList.remove('primary-colour');
    }
  
  } else {

    param.entry.value = param.entry.value || '';

    if (param.entry.value.toString() !== param.input.value) {

      param.entry.newValue = param.value || param.input.value || '';
      param.input.classList.add('primary-colour');

    } else {
      delete param.entry.newValue;

      // Change styling of input.
      param.input.classList.remove('primary-colour');
    }
  }

  if (param.entry.location.view.upload) {

    // Hide upload button if no other field in the infoj has a newValue.
    if (!param.entry.location.infoj.some(field => typeof field.newValue)) {
      param.entry.location.view.upload.disabled = true;
    } else {
      param.entry.location.view.upload.disabled = false;
    }

  }

};