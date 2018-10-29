// Create ACL connection pool for PostgreSQL.
module.exports = async () => {

  const acl_connection = (process.env.PUBLIC || process.env.PRIVATE) ?
    (process.env.PUBLIC || process.env.PRIVATE).split('|') : null;

  if (!acl_connection) return;

  // Set the maximum number of failed login attempts before an account will be locked.
  global.failed_attempts = parseInt(process.env.FAILED_ATTEMPTS) || 3;

  // Create PostgreSQL connection pool for ACL table.
  const pool = new require('pg').Pool({
    connectionString: acl_connection[0]
  });
  
  // Global acl table name.
  global.pg.acl = acl_connection[1];
  
  global.pg.users = async (q, arr) => {
  
    try {
      const { rows } = await pool.query(q, arr);
      return rows;
    
    } catch (err) {
      console.error(err);
      return { err: err };
    }

  };
    
  // Check ACL
  const acl_schema = {
    _id: 'integer',
    email: 'text',
    password: 'text',
    verified: 'boolean',
    approved: 'boolean',
    admin: 'boolean',
    verificationtoken: 'text',
    approvaltoken: 'text',
    failedattempts: 'integer',
    password_reset: 'text',
    api: 'text'
  };
    
  var rows = await global.pg.users(`
    SELECT column_name, data_type
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = '${global.pg.acl}';`);
    
  // Return empty object as workspace if no rows are returned from Postgres query.
  if (rows.err) return null;
    
  if (rows.some(row => (!acl_schema[row.column_name] || acl_schema[row.column_name] !== row.data_type))) {
    console.log('There seems to be a problem with the ACL configuration.');
    return null;
  }
  
};