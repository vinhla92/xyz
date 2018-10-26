module.exports = () => {

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
          console.error(err);
          return { err: err };
        }
    
      };
    }

  });

};