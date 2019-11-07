if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

//move map up on document scroll
document.addEventListener('scroll', () => document.getElementById('Map').style['marginTop'] = -parseInt(window.pageYOffset / 2) + 'px');

const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.querySelector('.listview').addEventListener('scroll',
    e => {
      if (e.target.scrollTop > 0) return e.target.classList.add('shadow');
      e.target.classList.remove('shadow');
    });

  tab.querySelector('.xyz-icon').onclick = e => {
    e.preventDefault();
    tabs.forEach(el => el.classList.remove('active'));
    e.target.parentElement.classList.add('active');
  }
});


_xyz({
  host: document.head.dataset.dir || new String(''),
  token: document.body.dataset.token,
  log: document.body.dataset.log,
  nanoid: document.body.dataset.nanoid,
  hooks: true,
  callback: init,
});

function init(_xyz) {

  createMap(_xyz);

  // Create locales dropdown if length of locales array is > 1.
  if (Object.keys(_xyz.workspace.locales).length > 1) {

    document.getElementById('localeDropdown').parentNode.insertBefore(_xyz.utils.wire()`<div class="title secondary-colour-bg">Locales</div>`, document.getElementById('localeDropdown'));

    document.getElementById('localeDropdown').style.marginBottom = '5px';

    document.getElementById('localeDropdown').appendChild(_xyz.utils.wire()`
    <div>Show layers for the following locale`);

    document.getElementById('localeDropdown').appendChild(_xyz.utils.wire()`
      <button class="ul-drop">
      <div
        class="head"
        onclick=${e => {
          e.preventDefault();
          e.target.parentElement.classList.toggle('active');
        }}>
        <span class="ul-title">${_xyz.workspace.locale.key}</span>
        <div class="icon"></div>
      </div>
      <ul>
        ${
          Object.values(_xyz.workspace.locales).map(
            locale => _xyz.utils.wire()`<li><a href="${_xyz.host + '?locale=' + locale.key}">${locale.key}`)
        }`);

  }

  // Select locations from hooks.
  _xyz.hooks.current.locations.forEach(_hook => {

    let hook = _hook.split('!');

    _xyz.locations.select({
      locale: _xyz.workspace.locale.key,
      layer: _xyz.layers.list[decodeURIComponent(hook[0])],
      table: hook[1],
      id: hook[2]
    });
  });

  if (_xyz.log) console.log(_xyz);
}

function createMap(_xyz) {

  // Create mapview control.
  _xyz.mapview.create({
    target: document.getElementById('Map'),
    attribution: {
      logo: _xyz.utils.wire()`
        <a
          class="logo"
          target="_blank"
          href="https://geolytix.co.uk"
          style="background-image: url('https://cdn.jsdelivr.net/gh/GEOLYTIX/geolytix@master/public/geolytix.svg');">`
    },
    view: {
      lat: _xyz.hooks.current.lat,
      lng: _xyz.hooks.current.lng,
      z: _xyz.hooks.current.z
    },
    scrollWheelZoom: true,
    btn: {
      ZoomIn: document.getElementById('btnZoomIn'),
      ZoomOut: document.getElementById('btnZoomOut'),
      Locate: document.getElementById('btnLocate'),
    }
  });

  _xyz.layers.listview.init({
    target: document.getElementById('layers'),
  });

  _xyz.locations.listview.init({
    target: document.getElementById('locations'),
    callbackInit: () => {
      document.getElementById('tabLocations').style.display = 'none';
      document.getElementById('tabLayers').querySelector('.xyz-icon').click();
    },
    callbackAdd: () => {
      document.getElementById('tabLocations').style.display = 'block';
      document.getElementById('tabLocations').querySelector('.xyz-icon').click();
    }
  });

  document.getElementById('clear_locations').onclick = () => {
    _xyz.hooks.remove('locations');

    _xyz.locations.list
      .filter(record => !!record.location)
      .forEach(record => record.location.remove());
  };

  _xyz.gazetteer.init({
    target: document.getElementById('gazetteer'),
    toggle: document.getElementById('btnGazetteer'),
  });
};