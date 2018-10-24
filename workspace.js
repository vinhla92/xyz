module.exports = async (fastify, startListen) => {

  // Create an array of promises for each DBS PostgreSQL connection.
  const DBS_promises = [];
  Object.keys(process.env).forEach(key => {
    if (key.split('_')[0] === 'DBS') DBS_promises.push(
      new Promise(resolve => {
        fastify.register(require('fastify-postgres'), {
          connectionString: process.env[key],
          name: key.split('_')[1]
        }).after(() => resolve());
      })
    );
  });

  // Set global workspace.
  global.workspace = {
    _defaults: {},
    public: {},
    private: {},
    admin: {}
  };

  // Register workspace routes.
  fastify.register((fastify, opts, next) => {

    // Get the stored workspace config for the token access level.
    fastify.route({
      method: 'GET',
      url: '/workspace/get',
      beforeHandler: fastify.auth([fastify.authAPI]),
      handler: (req, res) => {

        // Decode token from query or use a public access if no token has been provided.
        const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

        // Send workspace
        res.send(global.workspace[token.access].config);
      }
    });

    // Open workspace admin interface (tree view).
    fastify.route({
      method: 'GET',
      url: '/admin/workspace',
      beforeHandler: fastify.auth([fastify.authAdmin]),
      handler: (req, res) => {

        // Render and send admin template with 'tree' as view mode.
        res.type('text/html').send(require('jsrender').templates('./views/workspace_admin.html').render({
          dir: global.dir,
          mode: 'tree'
        }));
      }
    });

    // Open workspace admin interface (json view).
    fastify.route({
      method: 'GET',
      url: '/admin/workspacejson',
      beforeHandler: fastify.auth([fastify.authAdmin]),
      handler: (req, res) => {

        // Render and send admin template with 'code' as view mode.
        res.type('text/html').send(require('jsrender').templates('./views/workspace_admin.html').render({
          dir: global.dir,
          mode: 'code'
        }));
      }
    });

    // Save workspace provided in post body to the Postgres table.
    fastify.route({
      method: 'POST',
      url: '/admin/workspace/save',
      beforeHandler: fastify.auth([fastify.authAdminAPI]),
      handler: async (req, res) => {

        let workspace = await chkWorkspace(req.body.settings);

        if (process.env.WORKSPACE && process.env.WORKSPACE.split(':')[0] === 'postgres') {

          // Connect to Postgres database.
          let
            db = await fastify.pg.workspace.connect(),
            q = `INSERT INTO ${process.env.WORKSPACE.split('|').pop()} (settings)
                 SELECT $1 AS settings;`;
  
          // INSERT query to update the workspace in Postgres table.
          await db.query(q, [JSON.stringify(workspace)]);
  
          db.release();
  
        }
  
        await loadWorkspace(workspace);
  
        res.code(200).send(workspace);

      }
    });

    next();

  }, { prefix: global.dir });

  // Create workspace loader from Postgres database.
  if (process.env.WORKSPACE && process.env.WORKSPACE.split(':')[0] === 'postgres') {

    // Register Postgres connection string to fastify.
    await fastify.register(require('fastify-postgres'), {
      connectionString: process.env.WORKSPACE.split('|')[0],
      name: 'workspace'
    });

    // Assign load method to global workspace object.
    global.workspace.load = async fastify => {

      let
        workspace_db = await fastify.pg.workspace.connect(),
        workspace_table = process.env.WORKSPACE.split('|').pop(),
        config = await workspace_db.query(`SELECT * FROM ${workspace_table} ORDER BY _id DESC LIMIT 1`);

      workspace_db.release();

      // Return empty object as workspace if no rows are returned from Postgres query.
      if (config.rows.length === 0) return {};

      // Return settings from first row as workspace.
      return chkWorkspace(config.rows[0].settings);
    };
  }

  // Create file stream reader.
  const fs = require('fs');

  // Store workspace defaults.
  global.workspace._defaults = await JSON.parse(fs.readFileSync('./workspaces/_defaults.json'), 'utf8');

  // Create workspace loader for file in workspaces directory.
  if (process.env.WORKSPACE && process.env.WORKSPACE.split(':')[0] === 'file') {

    // Assign load method to global workspace object.
    global.workspace.load = () => {

      // Return empty object as workspace if file does not exist.
      if (!fs.existsSync('./workspaces/' + process.env.WORKSPACE.split(':').pop())) return chkWorkspace(global.workspace.admin.config || {});

      // Return workspace parsed as JSON from file stream.
      try {

        return chkWorkspace(JSON.parse(fs.readFileSync('./workspaces/' + process.env.WORKSPACE.split(':').pop()), 'utf8'));
      } catch (err) {
        console.error(err);
        return chkWorkspace(global.workspace.admin.config || {});
      }

    };
  }

  // Create zero config workspace if the WORKSPACE is not defined in environment.
  if (!process.env.WORKSPACE) {
    global.workspace.load = () => chkWorkspace(global.workspace.admin.config || {});
  }

  // Call initWorkspace() once all DBS_promises are resolved.
  Promise.all(DBS_promises).then(() => initWorkspace());

  // Wait for fastify to complete plugin registration.
  await fastify.ready();

  async function initWorkspace(){

    // Wait for workspaces to load and check then start listen for requests.
    await loadWorkspace();
    startListen();
  }

  async function loadWorkspace(workspace) {

    // Get admin workspace.
    global.workspace.admin.config = workspace || await global.workspace.load(fastify);

    await createLookup(global.workspace.admin);

    global.workspace.private.config = await removeAccess('admin');
    await createLookup(global.workspace.private);

    global.workspace.public.config = await removeAccess('private');
    await createLookup(global.workspace.public);
  }

  function removeAccess(access) {

    // deep clone the access level workspace.
    let config = JSON.parse(JSON.stringify(global.workspace[access].config));

    (function objectEval(o, parent, key) {

      // check whether the object has an access key matching the current level.
      if (Object.entries(o).some(e => e[0] === 'access' && e[1] === access)) {

        // if the parent is an array splice the key index.
        if (parent.length > 0) return parent.splice(parseInt(key), 1);

        // if the parent is an object delete the key from the parent.
        return delete parent[key];
      }

      // iterate through the object tree.
      Object.keys(o).forEach((key) => {
        if (o[key] && typeof o[key] === 'object') objectEval(o[key], o, key);
      });

    })(config);

    return config;
  }

  function createLookup(workspace) {

    // store all workspace string values in lookup arrays.
    workspace.values = ['', 'geom', 'geom_3857', 'id', 'ST_asGeoJson(geom)', 'ST_asGeoJson(geom_4326)'];
    (function objectEval(o) {
      Object.keys(o).forEach((key) => {
        if (typeof key === 'string') workspace.values.push(key);
        if (typeof o[key] === 'string') workspace.values.push(o[key]);
        if (o[key] && typeof o[key] === 'object') objectEval(o[key]);
      });
    })(workspace.config);
  }

  async function chkWorkspace(workspace) {

    // Get default workspace
    const _workspace = global.workspace._defaults.ws;

    // Check whether workspace keys are valid or missing.
    await chkOptionals(workspace, _workspace);

    // Check locales.
    await chkLocales(workspace.locales);

    return workspace;
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

  async function chkLayerGeom(layer, layers) {

    let tables = layer.tables ? Object.values(layer.tables) : [layer.table];

    for (const table of tables){

      if (!table) return;

      try {
        db_connection = await fastify.pg[layer.dbs].connect();
        result = await db_connection.query(`SELECT ${layer.geom_3857 || layer.geom} FROM ${table} LIMIT 1`);
        db_connection.release();
      } catch(err) {
        console.log(`${layer.format} | ${layer.dbs} | ${table} | ${err.message}`);
        layers['__'+layer.key] = layer;
        delete layers[layer.key];
        return;
      }

    }

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

      //console.log('error:', error); // Print the error if one occurred
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log('body:', body); // Print the HTML for the Google homepage.


    });

  }

  async function chkMVTCache(layer) {
  
    // Get all MVT tables defined in layer tables.
    let tables = layer.tables ? Object.values(layer.tables) : [layer.table];

    for (const table of tables){

      // Get a sample MVT from the cache table.
      try {
        db_connection = await fastify.pg[layer.dbs].connect();
        result = await db_connection.query(`SELECT z, x, y, mvt, tile FROM ${table}__mvts LIMIT 1`);
        db_connection.release();
      } catch(err) {
        console.log(err.code);
        await createMVTCache(layer, table);
      }

      // Check sample MVT.
      if (result.rows.length > 0) {

        const VectorTile = require('@mapbox/vector-tile').VectorTile;
        const Protobuf = require('pbf');
        const tile = new VectorTile(new Protobuf(result.rows[0].mvt));

        // Check if all mvt_fields are contained in cached MVT.
        for (const field in layer.mvt_fields){

          // Truncate cache table if field is not in sample MVT.
          if (tile.layers[layer.key]._keys.indexOf(field) < 0) {
            try {
              db_connection = await fastify.pg[layer.dbs].connect();
              await db_connection.query(`TRUNCATE ${table}__mvts;`);
              db_connection.release();
            } catch(err) {
              console.log(err.code);
            }
          }
        }
      }

    }
  
  }

  async function createMVTCache(layer, table){

    try {
      db_connection = await fastify.pg[layer.dbs].connect();
      await db_connection.query(`
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
  
      create index ${table.replace(/\./,'_')}__mvts_tile on ${table}__mvts (tile);
      `);
      db_connection.release();
    } catch(err) {
      console.log(err);
      // console.log(`${layer.format} | ${layer.dbs} | ${table} | ${err.message}`);
      // layers['__'+layer.key] = layer;
      // delete layers[layer.key];

      //await createMVTCache(layer);
      //return;
    }

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

      try {
        db_connection = await fastify.pg[layer.dbs].connect();
        result = await db_connection.query(`SELECT ${layer.qID} FROM ${table} LIMIT 1`);
        db_connection.release();
      } catch(err) {
        console.log(`${layer.dbs} | ${table} | ${layer.qID} | ${err.message}`);
        layer['__qID'] = layer.qID;
        delete layer.qID;
        return;
      }

    }

  }

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

};