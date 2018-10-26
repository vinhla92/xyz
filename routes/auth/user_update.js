module.exports = fastify => {
    
  fastify.route({
    method: 'POST',
    url: '/admin/user/update',
    beforeHandler: fastify.auth([fastify.authAdminAPI]),
    handler: async (req, res) => {
  
      // Get user to update from ACL.
      rows = await global.pg.users(`
          UPDATE ${global.pg.acl} SET ${req.body.role} = ${req.body.chk}
          WHERE lower(email) = lower($1);`,
      [req.body.email]);
  
      if (rows.err) return res.redirect(global.dir + '/login?msg=badconfig');
  
      // Send email to the user account if an account has been approved.
      if (req.body.role === 'approved' && req.body.chk)
        await require(global.appRoot + '/mod/mailer')({
          to: req.body.email,
          subject: `This account has been approved for ${global.alias || req.headers.host}${global.dir}`,
          text: `You are now able to log on to ${process.env.HTTP || 'https'}://${global.alias || req.headers.host}${global.dir}`
        });
  
      if (rows.length === 0) return res.code(500).send();
      if (rows.length === 1) return res.code(200).send();
    }
  });

};