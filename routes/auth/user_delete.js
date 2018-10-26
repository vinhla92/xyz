module.exports = fastify => {
    
  fastify.route({
    method: 'POST',
    url: '/admin/user/delete',
    beforeHandler: fastify.auth([fastify.authAdminAPI]),
    handler: async (req, res) => {

      // Delete user account in ACL.
      rows = await global.pg.users(`
      DELETE FROM ${global.pg.acl}
      WHERE lower(email) = lower($1);`,
      [req.body.email]);

      if (rows.err) return res.redirect(global.dir + '/login?msg=badconfig');

      if (rows.length === 0) return res.code(500).send();

      if (rows.length === 1) {

        // Sent email to inform user that their account has been deleted.
        await require(global.appRoot + '/mod/mailer')({
          to: req.body.email,
          subject: `This ${global.alias || req.headers.host}${global.dir} account has been deleted.`,
          text: `You will no longer be able to log in to ${process.env.HTTP || 'https'}://${global.alias || req.headers.host}${global.dir}`
        });

        res.code(200).send();
      }
    }
  });

};