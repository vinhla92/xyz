module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/catchment/location',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      /*const locale = global.workspace[token.access].config.locales[req.query.locale];

      // Return 406 if locale is not found in workspace.
      if (!locale) return res.code(406).send('Invalid locale.');

      const layer = locale.layers[req.query.layer];

      // Return 406 if layer is not found in locale.
      if (!layer) return res.code(406).send('Invalid layer.');

      const table = req.query.table;

      // Return 406 if table is not defined as request parameter.
      if (!table) return res.code(406).send('Missing table.');

      // Clone the infoj from the memory workspace layer.
      const infoj = JSON.parse(JSON.stringify(layer.infoj));

      const geom = req.query.geom || layer.geom;*/

      console.log(req.body);

      
    }
  });
};