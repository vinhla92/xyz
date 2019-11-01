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

    let entries = [];

    Object.values(_xyz.workspace.locales).map(locale => {
      entries.push(locale.key);
    });

    document.getElementById('localeDropdown').parentNode.insertBefore(_xyz.utils.wire()`
      <div class="title">Locales</div>`, document.getElementById('localeDropdown'));

    document.getElementById('localeDropdown').appendChild(_xyz.utils.wire()`
      <div><small>Show layers for the following locale`);

    document.getElementById('localeDropdown').appendChild(
      _xyz.utils.dropdownCustom({
        singleSelect: true,
        entries: entries,
        selectedIndex: entries.indexOf(_xyz.workspace.locale.key),
        callback: e => {
          _xyz.hooks.removeAll();
          _xyz.hooks.set({ locale: e.target.dataset.field });
          _xyz.workspace.loadLocale({ locale: _xyz.hooks.current.locale });
          document.getElementById('localeDropdown').querySelector('.head span').textContent = e.target.dataset.field;
          createMap(_xyz);
        }
      }));
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

  document.body.style.gridTemplateRows = 'minmax(0, 1fr) 0';

  const attribution = {};
  attribution[_xyz.version] = _xyz.release;
  attribution['Openlayers'] = 'https://openlayers.org';

  // Create mapview control.
  _xyz.mapview.create({
    target: document.getElementById('Map'),
    attribution: attribution,
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