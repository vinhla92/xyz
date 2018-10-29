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
  
  // Method to query ACL. arr must be empty array by default.
  global.pg.users = async (q, arr) => {

    try {
      const { rows } = await pool.query(q.replace(/acl_table/g, acl_connection[1]), arr);
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
    
  var users = await global.pg.users(`
  SELECT column_name, data_type
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'acl_table';`);
    
  if (users.length === 0) {

    // Set the default password for the admin user.
    const password = require('bcrypt-nodejs').hashSync('admin123', require('bcrypt-nodejs').genSaltSync(8));
    
    await global.pg.users(`
    CREATE TABLE IF NOT EXISTS acl_table (
	    "_id" serial not null,
	    email text not null,
	    password text not null,
	    verified boolean,
	    approved boolean,
	    admin boolean,
	    verificationtoken text,
	    approvaltoken text,
	    failedattempts integer default 0,
	    password_reset text,
	    api text
    );
    
    INSERT INTO acl_table (email, password, verified, approved, admin)
    SELECT
      'admin@geolytix.xyz' AS email,
      '${password}' AS password,
      true AS verified,
      true AS approved,
      true AS admin;
    `);

  } else if (users.some(row => (!acl_schema[row.column_name] || acl_schema[row.column_name] !== row.data_type))) {
    console.log('There seems to be a problem with the ACL configuration.');

  }
  
};