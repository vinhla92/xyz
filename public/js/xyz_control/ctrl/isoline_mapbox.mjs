export default _xyz => param => {

  param.entry.edit.isoline_mapbox.profile = param.entry.edit.isoline_mapbox.profile || 'driving';
  param.entry.edit.isoline_mapbox.minutes = param.entry.edit.isoline_mapbox.minutes || 10;

  const mode_container = _xyz.utils.wire()`<div style="margin-top: 8px;">`;

  param.container.appendChild(mode_container);

  mode_container.appendChild(_xyz.utils.wire()`<div style="display: inline-block; width: 20%;">Mode`);

  const setting_container = _xyz.utils.wire()`<div style="display: inline-block; width: 80%;">`;

  mode_container.appendChild(setting_container);

  const modes = [
    { Driving : 'driving' },
    { Walking: 'walking' },
    { Cycling: 'cycling' },
  ]

  param.entry.edit.isoline_mapbox.profile = 'driving';

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

          param.entry.edit.isoline_mapbox.profile = Object.values(keyVal)[0];

        }}>${Object.keys(keyVal)[0]}`)}`);


  param.container.appendChild(_xyz.utils.wire()`
  <div style="margin-top: 12px;">
  <span>Travel time in minutes: </span>
  <span class="bold">${param.entry.edit.isoline_mapbox.minutes}</span>
  <div class="range">
  <input
    class="secondary-colour-bg"
    type="range"
    min=5
    value=${param.entry.edit.isoline_mapbox.minutes}
    max=60
    step=1
    oninput=${e=>{
    param.entry.edit.isoline_mapbox.minutes = parseInt(e.target.value);
    e.target.parentNode.previousElementSibling.textContent = param.entry.edit.isoline_mapbox.minutes;
  }}>`);

};