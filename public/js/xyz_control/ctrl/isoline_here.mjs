export default _xyz => param => {

  const mode_container = _xyz.utils.wire()`<div style="margin-top: 8px">`;

  param.container.appendChild(mode_container);

  mode_container.appendChild(_xyz.utils.wire()`<span style="display: inline-block; width: 20%;">Mode`);

  const setting_container = _xyz.utils.wire()`<div style="display: inline-block; width: 80%;">`;

  mode_container.appendChild(setting_container);

  const modes = [
    {Driving : 'car'},
    {Walking: 'pedestrian'},
    {Cargo: 'truck'},
    {'HOV lane': 'carHOV'}
  ];

  param.entry.edit.isoline_here.mode = 'car';

  setting_container.appendChild(_xyz.utils.wire()`
  <button class="ul-drop">
  <div
    class="head"
    onclick=${e => {
      e.preventDefault();
      e.target.parentElement.classList.toggle('active');
    }}>
    <span class="ul-title">Driving</span>
    <div class="icon"></div>
  </div>
  <ul>
    ${modes.map(
      keyVal => _xyz.utils.wire()`
        <li onclick=${e=>{
          const drop = e.target.closest('.ul-drop');
          drop.classList.toggle('active');
          drop.querySelector('.ul-title').textContent = Object.keys(keyVal)[0];

          param.entry.edit.isoline_here.mode = Object.values(keyVal)[0];

        }}>${Object.keys(keyVal)[0]}`)}`);

  let range_container = _xyz.utils.wire()`<div style="margin-top: 8px;">`;

  param.container.appendChild(range_container);

  range_container.appendChild(_xyz.utils.wire()`<span style="display: inline-block; width: 20%;">Range`);

  const range_setting_container = _xyz.utils.wire()`<div style="display: inline-block; width: 80%;">`;

  range_container.appendChild(range_setting_container);

  const ranges = [
    { time: "Time (min)" },
    { distance: "Distance (km)" }
  ]

  param.entry.edit.isoline_here.rangetype = 'time';


  range_setting_container.appendChild(_xyz.utils.wire()`
  <button class="ul-drop">
  <div
    class="head"
    onclick=${e => {
      e.preventDefault();
      e.target.parentElement.classList.toggle('active');
    }}>
    <span class="ul-title">Time (min)</span>
    <div class="icon"></div>
  </div>
  <ul>
    ${ranges.map(
      keyVal => _xyz.utils.wire()`
        <li onclick=${e=>{
          const drop = e.target.closest('.ul-drop');
          drop.classList.toggle('active');
          drop.querySelector('.ul-title').textContent = Object.values(keyVal)[0];

          param.entry.edit.isoline_here.rangetype = Object.keys(keyVal)[0];

          const input = slider_here_range.querySelector('input');

          if(param.entry.edit.isoline_here.rangetype === 'time') {
    
            slider_here_range.querySelector('span').textContent = 'Travel time in minutes: ';
    
            input.oninput = e => {
              param.entry.edit.isoline_here.minutes = parseInt(e.target.value);
              e.target.parentNode.previousElementSibling.textContent = param.entry.edit.isoline_here.minutes;
            };
    
            input.value = param.entry.edit.isoline_here.minutes;
            input.parentNode.previousElementSibling.textContent = param.entry.edit.isoline_here.minutes;
          
          }
    
          if(param.entry.edit.isoline_here.rangetype === 'distance') {
    
            slider_here_range.querySelector('span').textContent = 'Travel distance in kilometer: ';
    
            input.oninput = e => {
              param.entry.edit.isoline_here.distance = parseInt(e.target.value);
              e.target.parentNode.previousElementSibling.textContent = param.entry.edit.isoline_here.distance;
            };
            input.value = param.entry.edit.isoline_here.distance;
            input.parentNode.previousElementSibling.textContent = param.entry.edit.isoline_here.distance;
          }

        }}>${Object.values(keyVal)[0]}`)}`);

  param.entry.edit.isoline_here.minutes = param.entry.edit.isoline_here.minutes || 10;

  param.entry.edit.isoline_here.distance = param.entry.edit.isoline_here.distance || 10;

  const slider_here_range = _xyz.utils.wire()`
  <div style="margin-top: 12px;">
  <span>Travel time in minutes: </span>
  <span class="bold">${param.entry.edit.isoline_here.minutes}</span>
  <div class="range">
  <input
    class="secondary-colour-bg"
    type="range"
    min=5
    value=${param.entry.edit.isoline_here.minutes}
    max=60
    step=1
    oninput=${e=>{
    param.entry.edit.isoline_here.minutes = parseInt(e.target.value);
    e.target.parentNode.previousElementSibling.textContent = param.entry.edit.isoline_here.minutes;
  }}>`;

  param.container.appendChild(slider_here_range);

};