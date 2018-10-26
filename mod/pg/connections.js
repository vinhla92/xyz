module.exports = () => {

  // Global pg stores all node postgres connection pools.
  global.pg = {};

  // Create PostGIS data connection pools.
  require('./dbs')();

  // Create PostgreSQL ACL connection pool.
  if (process.env.PUBLIC || process.env.PRIVATE) {
    require('./acl')((process.env.PUBLIC || process.env.PRIVATE).split('|'));
  }

  // Store provider keys.
  global.KEYS = {};
  Object.keys(process.env).forEach(key => {
    if (key.split('_')[0] === 'KEY') {
      global.KEYS[key.split('_')[1]] = process.env[key];
    }
  });

};