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

  global.pg.dbs = {};

  Object.keys(process.env).forEach(key => {
    if (key.split('_')[0] === 'DBS') {

      const pool = new require('pg').Pool({
        connectionString: process.env[key]
      });

      global.pg.dbs[key.split('_')[1]] = async (q, arr) => {

        try {
          const { rows } = await pool.query(q, arr);
          return rows;

        } catch (err) {
          console.error(rows.err);
          return { err: err };
        }

      };
    }
  });

  // Set global workspace.
  global.workspace = {
    _defaults: {},
    public: {},
    private: {},
    admin: {}
  };

  // Create workspace loader from Postgres database.
  if (process.env.WORKSPACE && process.env.WORKSPACE.split(':')[0] === 'postgres') {

    // Register Postgres connection string to fastify.
    const pool = new require('pg').Pool({
      connectionString: process.env.WORKSPACE.split('|')[0]
    });

    global.pg.ws = async q => {
      try {
        const { rows } = await pool.query(q);
        return rows;

      } catch (err) {
        return { err: err };
      }
    };

    // Assign load method to global workspace object.
    global.workspace.load = async () => {

      var workspace_table = process.env.WORKSPACE.split('|').pop();
      var config = await global.pg.ws(`SELECT * FROM ${workspace_table} ORDER BY _id DESC LIMIT 1`);

      if (config.err) return {};

      // Return empty object as workspace if no rows are returned from Postgres query.
      if (config.length === 0) return require('./check').chkWorkspace({});

      // Return settings from first row as workspace.
      return require('./check').chkWorkspace(config[0].settings);
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
      if (!fs.existsSync('./workspaces/' + process.env.WORKSPACE.split(':').pop())) return require('./check').chkWorkspace(global.workspace.admin.config || {});

      // Return workspace parsed as JSON from file stream.
      try {

        return require('./check').chkWorkspace(JSON.parse(fs.readFileSync('./workspaces/' + process.env.WORKSPACE.split(':').pop()), 'utf8'));
      } catch (err) {
        console.error(err);
        return require('./check').chkWorkspace(global.workspace.admin.config || {});
      }

    };
  }

  // Create zero config workspace if the WORKSPACE is not defined in environment.
  if (!process.env.WORKSPACE) {
    global.workspace.load = () => require('./check').chkWorkspace(global.workspace.admin.config || {});
  }

  // Call initWorkspace() once all DBS_promises are resolved.
  Promise.all(DBS_promises).then(() => initWorkspace());

  // Wait for fastify to complete plugin registration.
  await fastify.ready();

  async function initWorkspace() {

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
    
};