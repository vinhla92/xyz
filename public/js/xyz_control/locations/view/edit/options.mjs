export default _xyz => entry => {
  
  const chk = entry.edit.options.find(
    option => typeof option === 'object' && Object.values(option)[0] === entry.value || option === entry.value
  ) || entry.value

  entry.displayValue = typeof chk === 'object' && Object.keys(chk)[0] || chk || entry.value;

  entry.val.appendChild(_xyz.utils.wire()`
  <button class="ul-drop">
  <div
    class="head"
    onclick=${e => {
      e.preventDefault();
      e.target.parentElement.classList.toggle('active');
    }}>
    <span class="ul-title">${entry.displayValue}</span>
    <div class="icon"></div>
  </div>
  <ul>
    ${entry.edit.options.map(
      option => {

        let key = option;
        let value = option;

        if (typeof option === 'object') {
          key = Object.keys(option)[0];
          value = Object.values(option)[0];
        }
        
        return _xyz.utils.wire()`
        <li onclick=${e=>{
          const drop = e.target.closest('.ul-drop');
          drop.classList.toggle('active');
          drop.querySelector('.ul-title').textContent = key;
          drop.querySelector('.ul-title').value = value;

          // Set newValue and compare with current value.
          entry.location.view.valChange({
            input: drop.querySelector('.ul-title'),
            entry: entry
          });

          //if (entry.select_other) entry.select_other.remove();
          //entry.ctrl.optionsTextInput(entry);

        }}>${key}`
    })}`);

  //entry.ctrl.optionsTextInput(entry);

};