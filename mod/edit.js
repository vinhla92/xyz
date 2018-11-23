module.exports = { newRecord, newAggregate };

async function newRecord(req, res, fastify) {

  const token = req.query.token ?
    fastify.jwt.decode(req.query.token) : { access: 'public' };

  let
    layer = global.workspace[token.access].config.locales[req.body.locale].layers[req.body.layer],
    table = req.body.table,
    geom = layer.geom ? layer.geom : 'geom',
    geom_3857 = layer.format === 'mvt' ? (layer.geom_3857 ? layer.geom_3857 : 'geom_3857') : null,
    geometry = JSON.stringify(req.body.geometry),
    qID = layer.qID ? layer.qID : 'id';

  // Check whether string params are found in the settings to prevent SQL injections.
  if ([table, qID, geom]
    .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
    return res.code(406).send('Invalid parameter.');
  }

  const d = new Date();

  var q = `
    INSERT INTO ${table} (${geom} ${geom_3857 ? `, ${geom_3857}` : ''} ${layer.log ? `, ${layer.log.field || 'log'}` : ''})
        SELECT ST_SetSRID(ST_GeomFromGeoJSON('${geometry}'), 4326)
        ${geom_3857 ? `, ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('${geometry}'), 4326), 3857)` : ''}
        ${layer.log && layer.log.table ? `,'{ "user": "${token.email}", "op": "new", "time": "${Date.now()}"}'` : ''}
        RETURNING ${qID} AS id;`;

  var rows = await global.pg.dbs[layer.dbs](q);

  if (rows.err) return res.code(500).send('Failed to query PostGIS table.');

  if (layer.log && layer.log.table) await writeLog(layer, rows[0].id);

  if (layer.mvt_cache) await updateMvtCache(fastify, layer, rows[0].id);

  res.code(200).send(rows[0].id.toString());
}



async function writeLog(layer, id) {

  // Create duplicate of item in log table.
  var q = `
    INSERT INTO ${layer.log.table} 
    SELECT *
    FROM ${layer.table} WHERE ${layer.qID || 'id'} = $1;`;

  var rows = await global.pg.dbs[layer.dbs](q, [id]);

  if (rows.err) return res.code(500).send('Failed to query PostGIS table.');
}


async function updateMvtCache(fastify, layer, id) {

  var q = `
      DELETE FROM ${layer.mvt_cache} 
      WHERE ST_Intersects(tile, 
        (SELECT ${geom_3857} FROM ${layer.table} WHERE ${layer.qID || 'id'} = $1)
      );`;

  var rows = await global.pg.dbs[layer.dbs](q, [id]);

  if (rows.err) return res.code(500).send('Failed to query PostGIS table.');

}