module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select_ll_intersect',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      // require(global.appRoot + '/mod/location').select_ll_intersect(req, res, fastify);

      const token = req.query.token ?
        fastify.jwt.decode(req.query.token) : { access: 'public' };
  
      let
        locale = req.query.locale,
        layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
        table = req.query.table,
        geom = layer.geom ? layer.geom : 'geom',
        geomj = layer.geomj ? layer.geomj : `ST_asGeoJson(${geom})`,
        geomq = layer.geomq ? layer.geomq : 'geom',
        lat = parseFloat(req.query.lat),
        lng = parseFloat(req.query.lng),
        infoj = JSON.parse(JSON.stringify(layer.infoj));
  
      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table, geom, geomj, geomq, locale, layer]
        .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }
  
      let fields = '';
  
      infoj.forEach(entry => {
        if (entry.layer) {
          fields += `
              (SELECT ${entry.field.split('.')[0]}(${entry.field.split('.')[1]})
               FROM ${entry.layer.table}
               WHERE true ${sql_filter || `AND ST_Intersects(${entry.layer.table}.${entry.layer.geom || 'geom'}, ${table}.${geomq})`}
              ) AS "${entry.field}",`;
          return;
        }
  
        if (entry.type) fields += `${entry.fieldfx || entry.field}::${entry.type} AS ${entry.field},`;
  
        if (entry.subfield) fields += `${entry.subfield}::${entry.type} AS ${entry.subfield},`;
      });
  
      var q = `
      WITH T AS (
          SELECT
          ${geom} AS _geom
          FROM ${table}
          WHERE ST_Contains(${geom}, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
          LIMIT 1
      )
      SELECT
          ${fields}
          ${geomj} AS geomj
      FROM ${table}, T
      WHERE ST_Intersects(${geom}, _geom);`;
  
      var rows = await global.pg.dbs[layer.dbs](q);
  
      if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');
  
      // Iterate through the infoj object's entries and assign the values returned from the database query.
      rows.forEach(row => {
        infoj.forEach(entry => {
          if (row[entry.field] || row[entry.field] == 0) {
            entry.value = row[entry.field];
          }
          if (row[entry.subfield]) {
            entry.subvalue = row[entry.subfield];
          }
        });
      });
  
      // Send the infoj object with values back to the client.
      res.code(200).send(rows);

    }
  });
};