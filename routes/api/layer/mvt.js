module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/layer/mvt/:z/:x/:y',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      const token = req.query.token ?
        fastify.jwt.decode(req.query.token) : { access: 'public' };

      let
        layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
        table = req.query.table,
        geom_3857 = layer.geom_3857 ? layer.geom_3857 : 'geom_3857',
        filter = req.query.filter && JSON.parse(req.query.filter),
        id = layer.qID ? layer.qID : null,
        x = parseInt(req.params.x),
        y = parseInt(req.params.y),
        z = parseInt(req.params.z),
        m = 20037508.34,
        r = (m * 2) / (Math.pow(2, z));

      // Check whether string params are found in the settings to prevent SQL injections.
      if ([id, table, layer, geom_3857]
        .some(val => (typeof val === 'string' && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }

      // SQL filter
      const filter_sql = filter && await require(global.appRoot + '/mod/pg/sql_filter')(filter) || '';

      if (layer.mvt_cache) {

        // Get a sample MVT from the cache table.
        var rows = await global.pg.dbs[layer.dbs](`SELECT mvt FROM ${table}__mvts WHERE z = ${z} AND x = ${x} AND y = ${y}`);

        if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

      }

      if (rows && rows.length === 1) {
        res
          .type('application/x-protobuf')
          .code(200)
          .send(rows[0].mvt);
        return;
      }

      // ST_MakeEnvelope() in ST_AsMVT is based on https://github.com/mapbox/postgis-vt-util/blob/master/src/TileBBox.sql
      var q = `
          ${layer.mvt_cache ? `INSERT INTO ${table}__mvts (z, x, y, mvt, tile)` : ''}
          SELECT
              ${z},
              ${x},
              ${y},
              ST_AsMVT(tile, '${req.query.layer}', 4096, 'geom') mvt,
              ST_MakeEnvelope(
                  ${-m + (x * r)},
                  ${ m - (y * r)},
                  ${-m + (x * r) + r},
                  ${ m - (y * r) - r},
                  3857
              ) tile
          FROM (
              SELECT
                  ${id} id,
                  ${layer.mvt_fields ? layer.mvt_fields.toString() + ',' : ''}
                  ST_AsMVTGeom(
                      ${geom_3857},
                      ST_MakeEnvelope(
                          ${-m + (x * r)},
                          ${ m - (y * r)},
                          ${-m + (x * r) + r},
                          ${ m - (y * r) - r},
                          3857
                      ),
                      4096,
                      256,
                      true) geom
              FROM ${table}
              WHERE ST_DWithin(ST_MakeEnvelope(
                  ${-m + (x * r)},
                  ${ m - (y * r)},
                  ${-m + (x * r) + r},
                  ${ m - (y * r) - r},
                  3857
              ),${geom_3857},0)
              ${filter_sql}
          ) tile
          ${layer.mvt_cache ? 'RETURNING mvt;' : ';'}
          `;

      rows = await global.pg.dbs[layer.dbs](q);

      if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

      res
        .type('application/x-protobuf')
        .code(200)
        .send(rows[0].mvt);

    }
  });
};