module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/new/aggregate',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {
    
      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      const locale = global.workspace[token.access].config.locales[req.query.locale];

      // Return 406 if locale is not found in workspace.
      if (!locale) return res.code(406).send('Invalid locale.');

      const layer = locale.layers[req.query.layer];

      if (!layer) return res.code(500).send('Layer not found.');

      const target_layer = locale.layers[layer.filter.output.layer];

      if (!target_layer) return res.code(500).send('Target layer not set.');
      
      let
        table_source = layer.table,
        table_target = target_layer.table,
        geom_source = layer.geom,
        geom_target = target_layer.geom,
        filter = JSON.parse(req.query.filter);
      
      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table_target, table_source]
        .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }
      
      // let access_filter = layer.access_filter && token.email && layer.access_filter[token.email.toLowerCase()] ?
      //   layer.access_filter[token.email] : null;
      
      // SQL filter
      const filter_sql = filter && await require(global.appRoot + '/mod/pg/sql_filter')(filter) || '';

      
      var q = `
          INSERT INTO ${table_target} (${geom_target}, sql_filter)
              SELECT
              ST_Transform(
                  ST_SetSRID(
                  ST_Buffer(
                      ST_Transform(
                      ST_SetSRID(
                          ST_Extent(${geom_source}),
                      4326),
                      3857),
                      ST_Distance(
                      ST_Transform(
                          ST_SetSRID(
                          ST_Point(
                              ST_XMin(ST_Envelope(ST_Extent(${geom_source}))),
                              ST_YMin(ST_Envelope(ST_Extent(${geom_source})))),
                          4326),
                      3857),
                      ST_Transform(
                          ST_SetSRID(
                          ST_Point(
                              ST_XMax(ST_Envelope(ST_Extent(${geom_source}))),
                              ST_Ymin(ST_Envelope(ST_Extent(${geom_source})))),
                          4326),
                      3857)
                      ) * 0.1),
                  3857),
              4326) AS ${geom_target},
              '${filter_sql.replace(new RegExp('\'', 'g'), '\'\'')}' as sql_filter
              FROM ${table_source}
              WHERE true ${filter_sql}
          
          RETURNING id, ST_X(ST_Centroid(geom)) as lng, ST_Y(ST_Centroid(geom)) as lat;`;
      
      var rows = await global.pg.dbs[layer.dbs](q);
      
      if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');
      
      res.code(200).send({
        id: rows[0].id.toString(),
        lat: parseFloat(rows[0].lat),
        lng: parseFloat(rows[0].lng),
        filter: filter
      });

    }
  });
};