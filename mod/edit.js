module.exports = { newRecord, newAggregate, setIndices };

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
    return res.code(406).send('Parameter not acceptable.');
  }

  const d = new Date();

  var q = `
    INSERT INTO ${table} (${geom} ${geom_3857 ? `, ${geom_3857}` : ''} ${layer.log ? `, ${layer.log.field || 'log'}` : ''})
        SELECT ST_SetSRID(ST_GeomFromGeoJSON('${geometry}'), 4326)
        ${geom_3857 ? `, ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('${geometry}'), 4326), 3857)` : ''}
        ${layer.log && layer.log.table ? `,'{ "user": "${token.email}", "op": "new", "time": "${d.toUTCString()}"}'`: ''}
        RETURNING ${qID} AS id;`;

  var rows = await global.pg.dbs[layer.dbs](q);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

  if (layer.log && layer.log.table) await writeLog(layer, rows[0].id);

  if(layer.mvt_cache) await updateMvtCache(fastify, layer, rows[0].id);

  res.code(200).send(rows[0].id.toString());
}

async function newAggregate(req, res, fastify) {

  const token = req.query.token ?
    fastify.jwt.decode(req.query.token) : { access: 'public' };

  let
    layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
    target_layer = global.workspace[token.access].config.locales[req.query.locale].layers[layer.aggregate_layer],
    table_source = layer.table,
    table_target = target_layer.table,
    geom_source = layer.geom ? layer.geom : 'geom',
    geom_target = target_layer.geomq ? target_layer.geomq : 'geom',
    filter = JSON.parse(req.query.filter) || {},
    filter_sql = '';

  // Check whether string params are found in the settings to prevent SQL injections.
  if ([table_target, table_source, geom_target, geom_source]
    .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
    return res.code(406).send('Parameter not acceptable.');
  }

  let access_filter = layer.access_filter && token.email && layer.access_filter[token.email.toLowerCase()] ?
    layer.access_filter[token.email] : null;

  filter_sql = await require('./filters').sql_filter(filter, filter_sql);

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
        WHERE true ${filter_sql} ${access_filter ? 'and ' + access_filter : ''}
    
    RETURNING id, ST_X(ST_Centroid(geom)) as lng, ST_Y(ST_Centroid(geom)) as lat, sql_filter;`;

  var rows = await global.pg.dbs[layer.dbs](q);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

  res.code(200).send({
    id: rows[0].id.toString(),
    lat: parseFloat(rows[0].lat),
    lng: parseFloat(rows[0].lng),
    filter: filter
  });
}

async function writeLog(layer, id) {

  // Create duplicate of item in log table.
  var q = `
    INSERT INTO ${layer.log.table} 
    SELECT *
    FROM ${layer.table} WHERE ${layer.qID || 'id'} = $1;`;

  var rows = await global.pg.dbs[layer.dbs](q, [id]);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');
}

async function updateMvtCache(fastify, layer, id){

  var q = `
      DELETE FROM ${layer.mvt_cache} 
      WHERE ST_Intersects(tile, 
        (SELECT ${geom_3857} FROM ${layer.table} WHERE ${layer.qID || 'id'} = $1)
      );`;

  var rows = await global.pg.dbs[layer.dbs](q, [id]);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

}

async function setIndices(req, res, fastify){
  
  const del = '__'; // column alias delimiter

  const token = req.query.token ?
    fastify.jwt.decode(req.query.token) : { access: 'public' };

  let
    params = req.body,
    idx = params.idx;

  let layer = global.workspace[token.access].config.locales[params.locale].layers[params.layer];

  let fields = [];
  Object.keys(idx).map(key => {
    let row = `MAX(${key}) as ${key}${del}max, MIN(${key}) as ${key}${del}min, AVG(${key}) as ${key}${del}avg`;
    fields.push(row);
  });

  let q = `SELECT ${fields.join(',')} FROM ${params.table}`;
    
  var rows = await global.pg.dbs[layer.dbs](q);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');


  Object.keys(rows[0]).forEach(key => {
    let _k = key.split(del);
        
    if(!_k.length || _k.length < 2) return;
        
    if(_k.length === 2){
      idx[_k[0]][_k[1]] = rows[0][key];
    } else {
      let _fn = _k[_k.length-1];
      let _f = _k.slice(0, _k.length-1);
      _f = _f.join(del);

      idx[_f][_fn] = rows[0][key];
    }
  });

  //console.log(idx);
  res.code(200).send(idx);

}