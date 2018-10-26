module.exports = fastify => {
    
  fastify.route({
    method: 'GET',
    url: '/admin/user',
    beforeHandler: fastify.auth([fastify.authAdmin]),
    handler: async (req, res) => {

      // Get user list from ACL.
      rows = await global.pg.users(`
      SELECT email, verified, approved, admin, failedattempts
      FROM ${global.pg.acl};`);

      if (rows.err) return res.redirect(global.dir + '/login?msg=badconfig');

      res
        .type('text/html')
        .send(require('jsrender')
          .templates('./public/views/admin.html')
          .render({
            users: rows,
            dir: global.dir
          })
        );
    }
  });

};