module.exports = fastify => {
    
  fastify.route({
    method: 'GET',
    url: '/user/log',
    preValidation: fastify.auth([
      (req, res, done) => fastify.authToken(req, res, done, {
        admin_user: true
      })
    ]),
    handler: async (req, res) => {

      //const token = await fastify.jwt.decode(req.query.token);

      const email = req.query.email.replace(/\s+/g,'');

      // Get user to update from ACL.
      var rows = await global.pg.users(`
      SELECT access_log
      FROM acl_schema.acl_table
      WHERE lower(email) = lower($1);`,
      [email]);
  
      if (rows.err) return res.redirect(global.dir + '/login?msg=badconfig');
  
      return res.code(200).send(rows[0].access_log);
    }
  });

};