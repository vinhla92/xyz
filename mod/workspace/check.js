module.exports = async workspace => {
  
  // Get default workspace
  const _workspace = global.workspace._defaults.ws;
  
  // Check whether workspace keys are valid or missing.
  await chkOptionals(workspace, _workspace);
  
  // Check locales.
  await chkLocales(workspace.locales);
  
  return workspace;
};

function chkOptionals(chk, opt) {
  
  // Check whether optionals exist.
  Object.keys(chk).forEach(key => {
  
    if (chk[key] === 'optional') return delete chk[key];
  
    if (!(key in opt)) {
  
      // Prefix key with double underscore if opt key does not exist.
      chk['__' + key] = chk[key];
      delete chk[key];
    }
  });
  
  // Set default for non optional key values.
  Object.keys(opt).forEach(key => {
    if (!(key in chk) && opt[key] !== 'optional') chk[key] = opt[key];
  });
}

async function chkLocales(locales) {   
  
  // Iterate through locales.
  for (const key of Object.keys(locales)) {
  
    // Set default locale.
    const
      locale = locales[key],
      _locale = global.workspace._defaults.locale;
  
    // Invalidate locale if it is not an object.
    if (typeof locale !== 'object') {
      locales['__' + key] = locale;
      delete locales[key];
      return;
    }
  
    // Check whether locale keys are valid or missing.
    await chkOptionals(locale, _locale);
  
    // Check bounds.
    await chkOptionals(locale.bounds, _locale.bounds);
  
    // Check gazetteer.
    //
  
    // Check layers in locale.
    await chkLayers(locale.layers);
  
  }
}

async function chkLayers(layers) {

  // Iterate through loayers.
  for (const key of Object.keys(layers)) {

    const layer = layers[key];

    // Invalidate layer if it is not an object or does not have a valid layer format.
    if (typeof layer !== 'object'
        || !layer.format
        || !global.workspace._defaults.layers[layer.format]) {
      layers['__' + key] = layer;
      delete locale.layers[key];
      return;
    }

    // Assign layer default from layer and format defaults.
    const _layer = Object.assign({},
      global.workspace._defaults.layers.default,
      global.workspace._defaults.layers[layer.format]
    );

    // Set layer key and name.
    layer.key = key;
    layer.name = layer.name || key;

    // Check whether layer keys are valid or missing.
    await chkOptionals(layer, _layer);

    // Check whether layer.style keys are valid or missing.
    if (layer.style) await chkOptionals(layer.style, _layer.style);

    // Check whether the layer connects.
    await chkLayerConnect(layer, layers);

    // Check or create mvt_cache table.
    if (layer.mvt_cache) await chkMVTCache(layer);

    // Check whether the layer connects.
    if (layer.qID) await chkLayerSelect(layer);

  }
}

async function chkLayerConnect(layer, layers) {

  if (layer.format === 'tiles') return chkLayerURL(layer, layers);

  if (layer.format === 'cluster') await chkLayerGeom(layer, layers);

  if (layer.format === 'geojson') await chkLayerGeom(layer, layers);

  if (layer.format === 'grid') await chkLayerGeom(layer, layers);

  if (layer.format === 'mvt') await chkLayerGeom(layer, layers);

}

async function chkLayerURL(layer, layers) {

  // Get uri from layer and split at provider definition.
  let uri = layer.URI.split('&provider=');

  // Replace provider definition with provider key.
  uri = `${uri[0]}${uri[1] ? global.KEYS[uri[1]] : ''}`;

  // Replace subdomain (a) and x,y,z (0) location.
  uri = uri.replace(/\{s\}/i,'a').replace(/\{.\}/ig,'0');

  const req = require('request');

  await req(uri, function (error, response) {
    if (error || (response && response.statusCode !== 200)) {

      console.log(`${layer.format} | ${layer.URI} | ${error ? error.code : response.statusCode}`);

      // Make layer invalid if tiles service is not readable.
      layers['__'+layer.key] = layer;
      delete layers[layer.key];
    }

  });

}

async function chkLayerGeom(layer, layers) {

  let tables = layer.tables ? Object.values(layer.tables) : [layer.table];

  for (const table of tables){

    if (!table) return;

    let rows = await global.pg.dbs[layer.dbs](`SELECT ${layer.geom_3857 || layer.geom} FROM ${table} LIMIT 1`);

    if (rows.err) {
      console.log(`${layer.format} | ${layer.dbs} | ${table} | ${rows.err.message}`);
      layers['__'+layer.key] = layer;
      delete layers[layer.key];
      return;
    }

  }

}

async function chkMVTCache(layer) {
  
  // Get all MVT tables defined in layer tables.
  let tables = layer.tables ? Object.values(layer.tables) : [layer.table];

  for (const table of tables){

    // Get a sample MVT from the cache table.
    let rows = await global.pg.dbs[layer.dbs](`SELECT z, x, y, mvt, tile FROM ${table}__mvts LIMIT 1`);

    if (rows.err) {
      console.log(rows.err.code);
      await createMVTCache(layer, table);
    }

    // Check sample MVT.
    if (rows.length > 0) {

      const VectorTile = require('@mapbox/vector-tile').VectorTile;
      const Protobuf = require('pbf');
      const tile = new VectorTile(new Protobuf(rows[0].mvt));

      // Check if all mvt_fields are contained in cached MVT.
      for (const field of layer.mvt_fields){

        // Truncate cache table if field is not in sample MVT.
        if (Object.keys(tile.layers).length > 0 && tile.layers[layer.key]._keys.indexOf(field) < 0) {

          // Get a sample MVT from the cache table.
          rows = await global.pg.dbs[layer.dbs](`TRUNCATE ${table}__mvts;`);

          if (rows.err) {
            console.log(rows.err.code);
          }
        }
      }
    }

  }
  
}

async function createMVTCache(layer, table){

  let rows = await global.pg.dbs[layer.dbs](`
    create table ${table}__mvts
    (
      z integer not null,
      x integer not null,
      y integer not null,
      mvt bytea,
      tile geometry(Polygon,3857),
      constraint ${table.replace(/\./,'_')}__mvts_z_x_y_pk
        primary key (z, x, y)
    );
    
    create index ${table.replace(/\./,'_')}__mvts_z_x_y_idx on ${table}__mvts (z, x, y);

    create index ${table.replace(/\./,'_')}__mvts_tile on ${table}__mvts (tile);`);

  if (rows.err) layer.mvt_cache = false;

}

async function chkLayerSelect(layer) {

  // Create default infoj if non exist on selectable layer.
  if (!layer.infoj) {
    layer.infoj = [
      {
        field: layer.qID,
        label: 'qID',
        type: 'text',
        inline: true
      }
    ];
  }

  let tables = layer.tables ? Object.values(layer.tables) : [layer.table];

  for (const table of tables){

    if (!table) return;

    let rows = await global.pg.dbs[layer.dbs](`SELECT ${layer.qID} FROM ${table} LIMIT 1`);

    if (rows.err) {
      console.log(`${layer.dbs} | ${table} | ${layer.qID} | ${rows.err.message}`);
      layer['__qID'] = layer.qID;
      delete layer.qID;
      return;
    }

  }

}