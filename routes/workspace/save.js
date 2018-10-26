// Save workspace provided in post body to the Postgres table.
module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/admin/workspace/save',
    beforeHandler: fastify.auth([fastify.authAdminAPI]),
    handler: async (req, res) => {
        
      let workspace = await require('./mod/workspace/check')(req.body.settings);
        
      if (process.env.WORKSPACE && process.env.WORKSPACE.split(':')[0] === 'postgres') {
        
        let q = `INSERT INTO ${process.env.WORKSPACE.split('|').pop()} (settings) SELECT $1 AS settings;`;
  
        await global.pg.ws(q, [JSON.stringify(workspace)]);
          
      }
          
      await require(global.appRoot + '/mod/workspace/load')(workspace);
          
      res.code(200).send(workspace);
        
    }
  });
};