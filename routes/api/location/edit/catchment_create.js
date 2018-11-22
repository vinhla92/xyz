module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/catchment/create',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      //console.log(req.body);

      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      const locale = global.workspace[token.access].config.locales[req.body.locale];

      // Return 406 if locale is not found in workspace.
      if (!locale) return res.code(406).send('Invalid locale.');

      const layer = locale.layers[req.body.layer];

      // Return 406 if layer is not found in locale.
      if (!layer) return res.code(406).send('Invalid layer.');

      const table = req.body.table;

      // Return 406 if table is not defined as request parameter.
      if (!table) return res.code(406).send('Missing table.');

      let
        qID = layer.qID,
        id = req.body.id,
        infoj = layer.infoj,
        field = req.body.field,
        params = req.body.params,
        geom = layer.geom;

      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table, field]
        .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }
      //res.code(200).send({features: 'hello'});
        
      const mapbox_isochrones = await require(global.appRoot + '/mod/mapbox_isochrones')(params);

      if(mapbox_isochrones.features){

        //console.log(JSON.stringify(mapbox_isochrones.features[0].geometry));

        var q = `UPDATE ${table} SET ${field} = ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(mapbox_isochrones.features[0].geometry)}'), 4326) WHERE ${qID} = $1;`;

        var rows = await global.pg.dbs[layer.dbs](q, [id]);

        if (rows.err) return res.code(500).send('PostgreSQL query error - please check backend logs.');

        // Query field for updated infoj
        infoj = JSON.parse(JSON.stringify(layer.infoj));

        // The fields array stores all fields to be queried for the location info.
        fields = await require(global.appRoot + '/mod/pg/sql_fields')([], infoj, locale, table, layer);

        q =
        `SELECT ${fields.join()}`
        + `\n FROM ${table}`
        + `\n WHERE ${qID} = $1;`;

        console.log(q);
        console.log(id);

        var rows = await global.pg.dbs[layer.dbs](q, [id]);

        if (rows.err) return res.code(500).send('Failed to query PostGIS table.');

        // Iterate through infoj entries and assign values returned from query.
        infoj.forEach(entry =>  {
          if (rows[0][entry.field]) entry.value = rows[0][entry.field];
        });

        // Send the infoj object with values back to the client.
        res.code(200).send(infoj);

      } else {
        return res.code(406).send('No catchment found withing this time frame.');
      }
    }
  });
};