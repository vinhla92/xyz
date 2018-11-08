module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/layer/extent',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      const locale = global.workspace[token.access].config.locales[req.query.locale];

      // Return 406 if locale is not found in workspace.
      if (!locale) return res.code(406).send('Invalid locale.');

      const layer = locale.layers[req.query.layer];

      // Return 406 if locale is not found in workspace.
      if (!layer) return res.code(406).send('Invalid layer.');

      let
        geom = layer.geom,

        // Get table entry from layer or first entry from tables array.
        table = layer.table || Object.values(layer.tables)[0];

      // Check whether string params are found in the settings to prevent SQL injections.
      if ([geom]
        .some(val => (typeof val === 'string' && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }

      // Query the estimated extent for the layer geometry field from layer table.
      rows = await global.pg.dbs[layer.dbs](`SELECT ST_EstimatedExtent('${table}','${geom}');`);

      if (rows.err) return res.code(500).send('Failed to query PostGIS table.');

      // Get bounds from first row value.
      const bounds = Object.values(Object.values(rows)[0])[0];

      // Return 204 if bounds couldn't be formed.
      if (!bounds) return res.code(204).send('No bounds.');

      // Regex format bounds as comma separated string and return to client.
      res.code(200).send(/\((.*?)\)/.exec(bounds)[1].replace(/ /g, ','));

    }
  });
};