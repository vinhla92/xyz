// Create DBS connection pools for PostGIS.
module.exports = () => {

  global.pg.dbs = {};
  
  // Iterate through environment variables to find DBS_* entries.
  Object.keys(process.env).forEach(key => {

    if (key.split('_')[0] === 'DBS') {
    
      // Create connection pool.
      const pool = new require('pg').Pool({
        connectionString: process.env[key]
      });
    
      // Request which accepts q and arr and will return rows or rows.err.
      global.pg.dbs[key.split('_')[1]] = async (q, arr) => {
    
        try {
          const { rows } = await pool.query(q, arr);
          return rows;
    
        } catch (err) {
          console.error(err);
          return { err: err };
        }
    
      };
    }

  });

};