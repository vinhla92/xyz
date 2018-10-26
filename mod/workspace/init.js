module.exports = async startListen => {

  // Create file stream reader.
  const fs = require('fs');

  // Set global workspace.
  global.workspace = {
    _defaults: await JSON.parse(fs.readFileSync('./workspaces/_defaults.json'), 'utf8'),
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

    global.pg.ws = async (q, arr) => {
      try {
        const { rows } = await pool.query(q, arr);
        return rows;

      } catch (err) {
        console.error(err);
        return { err: err };
      }
    };

    // Assign load method to global workspace object.
    global.workspace.load = async () => {

      var workspace_table = process.env.WORKSPACE.split('|').pop();
      var config = await global.pg.ws(`SELECT * FROM ${workspace_table} ORDER BY _id DESC LIMIT 1`);

      // Return empty object as workspace if no rows are returned from Postgres query.
      if (confif.err || config.length === 0) return require('./check')({});

      // Return settings from first row as workspace.
      return require('./check')(config[0].settings);
    };
  }

  // Create workspace loader for file in workspaces directory.
  if (process.env.WORKSPACE && process.env.WORKSPACE.split(':')[0] === 'file') {

    // Assign load method to global workspace object.
    global.workspace.load = () => {

      // Return empty object as workspace if file does not exist.
      if (!fs.existsSync('./workspaces/' + process.env.WORKSPACE.split(':').pop())) return require('./check')(global.workspace.admin.config || {});

      // Return workspace parsed as JSON from file stream.
      try {
        return require('./check')(JSON.parse(fs.readFileSync('./workspaces/' + process.env.WORKSPACE.split(':').pop()), 'utf8'));
      } catch (err) {
        console.error(err);
        return require('./check')(global.workspace.admin.config || {});
      }

    };
  }

  // Create zero config workspace if the WORKSPACE is not defined in environment.
  if (!process.env.WORKSPACE) {
    global.workspace.load = () => require('./check')(global.workspace.admin.config || {});
  }

  await require('./load')();

  startListen();

};