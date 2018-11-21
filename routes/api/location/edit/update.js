module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/update',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      const layer = global.workspace[token.access].config.locales[req.body.locale].layers[req.body.layer];

      if (!layer) return res.code(500).send('Layer not found.');

      let
        table = req.body.table,
        qID = layer.qID,
        id = req.body.id,
        infoj = req.body.infoj,
        geom = layer.geom;

      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table, geom, qID]
        .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }

      const fields = await processInfoj(infoj);

      // const d = new Date();

      // const q_log = layer.log && layer.log.table ?
      //   `, ${layer.log.field || 'log'} = '{ "user": "${token.email}", "op": "update", "time": "${d.toUTCString()}"}'`
      //   : '';

      // Write into logtable if logging is enabled.
      // if (layer.log && layer.log.table) await writeLog(layer, id);

      var q = `UPDATE ${table} SET ${fields} WHERE ${qID} = $1;`;

      console.log(q);
      console.log(id);

      var rows = await global.pg.dbs[layer.dbs](q, [id]);

      if (rows.err) return res.code(500).send('PostgreSQL query error - please check backend logs.');


      // Query field for updated infoj
      infoj = JSON.parse(JSON.stringify(layer.infoj));

      geom = layer.geom ?
        `${table}.${layer.geom}`
        : `(ST_Transform(ST_SetSRID(${table}.${layer.geom_3857}, 3857), 4326))`;

      // The fields array stores all fields to be queried for the location info.
      fields = await require(global.appRoot + '/mod/pg/sql_fields')([], infoj, locale, table, geom);

      // Push JSON geometry field into fields array.
      fields.push(`\n   ST_asGeoJson(${geom}) AS geomj`);

      var q =
      `SELECT ${fields.join()}`
      + `\n FROM ${table}`
      + `\n WHERE ${qID} = $1;`;

      var rows = await global.pg.dbs[layer.dbs](q, [id]);

      if (rows.err) return res.code(500).send('Failed to query PostGIS table.');

      // Iterate through infoj entries and assign values returned from query.
      infoj.forEach(entry =>  {
        if (rows[0][entry.field]) entry.value = rows[0][entry.field];
      });
    
      // Send the infoj object with values back to the client.
      res.code(200).send({
        geomj: rows[0].geomj,
        infoj: infoj
      });

    }
  });
};

async function processInfoj(infoj) {

  let fields = '';

  await infoj.forEach(entry => {

    console.log(entry);

    if (!entry.field) return;

    if (fields.length > 0) fields += ', ';

    // if (entry.type === 'integer') return fields += `${entry.field} = ${entry.newValue},`;

    if (entry.type === 'date') return fields += `${entry.field} = ${entry.newValue}`;

    fields += `${entry.field} = '${entry.newValue.replace(/'/g, '\'\'')}'`;

  });

  return fields;
}