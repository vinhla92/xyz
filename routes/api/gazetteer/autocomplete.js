module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/gazetteer/autocomplete',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      const locale = global.workspace[token.access].config.locales[req.query.locale];

      if (!locale) return res.code(406).send('Invalid locale.');

      if (!locale.gazetteer) return res.code(406).send('Gazetteer not defined for locale.');

      const term = req.query.q;

      if (!term) return res.code(406).send('No serch term.');

      let results = [];

      // Locale gazetteer which can query datasources in the same locale.
      if (locale.gazetteer.datasets) {
        results = await require(global.appRoot + '/mod/gazetteer/locale')(term, locale);

        // Return error message err if an error occured.
        if (results.err) return res.code(500).send(results.err);

        // Return and send results to client.
        if (results.length > 0) return res.code(200).send(results);
      }


      // Query Google Maps API
      if (locale.gazetteer.provider === 'GOOGLE') {
        results = await require(global.appRoot + '/mod/gazetteer/google')(term, locale.gazetteer);

        // Return error message err if an error occured.
        if (results.err) return res.code(500).send(results.err);
      }

      // Query Mapbox Geocoder API
      if (locale.gazetteer.provider === 'MAPBOX') {
        results = await require(global.appRoot + '/mod/gazetteer/mapbox')(term, locale.gazetteer);

        // Return error message err if an error occured.
        if (results.err) return res.code(500).send(results.err);
      }

      // Return results to client.
      res.code(200).send(results);

    }
  });
};