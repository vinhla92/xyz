export default _xyz => entry => {

  // Map first level options and keys to the options object.
  const options = entry.edit.options.map(option => {

    // Return the first key when there are suboptions.
    if (typeof option === 'object') return Object.keys(option)[0];

    // Return the option text when there are no suboptions.
    return option;
  });

  //options.push(' ');

  entry.val.appendChild(_xyz.utils.wire()`
  <button class="ul-drop">
  <div
    class="head"
    onclick=${e => {
      e.preventDefault();
      e.target.parentElement.classList.toggle('active');
    }}>
    <span class="ul-title">${entry.value}</span>
    <div class="icon"></div>
  </div>
  <ul>
    ${options.map(
      key => _xyz.utils.wire()`
        <li onclick=${e=>{
          const drop = e.target.closest('.ul-drop');
          drop.classList.toggle('active');
          drop.querySelector('.ul-title').textContent = key;
          drop.querySelector('.ul-title').value = key;

          // Set newValue and compare with current value.
          entry.location.view.valChange({
            input: drop.querySelector('.ul-title'),
            entry: entry
          });

          //if (entry.select_other) entry.select_other.remove();
          //entry.ctrl.optionsTextInput(entry);

        }}>${key}`)}`);

  //entry.ctrl.optionsTextInput(entry);

};