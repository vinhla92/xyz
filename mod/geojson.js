module.exports = { get };

async function get(req, res, fastify) {

  const token = req.query.token ?
    fastify.jwt.decode(req.query.token) : { access: 'public' };

  let
    layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
    geom = layer.geom ? layer.geom : 'geom',
    table = req.query.table,
    id = layer.qID ? layer.qID : 'id',
    properties = layer.properties ? layer.properties : '',
    geomj = layer.geomj ? layer.geomj : `ST_asGeoJson(${geom})`,
    west = parseFloat(req.query.west),
    south = parseFloat(req.query.south),
    east = parseFloat(req.query.east),
    north = parseFloat(req.query.north);

  // Check whether string params are found in the settings to prevent SQL injections.
  if ([table, geom, id, properties]
    .some(val => (typeof val === 'string' && global.workspace[token.access].values.indexOf(val) < 0))) {
    return res.code(406).send('Parameter not acceptable.');
  }

  if (properties) properties = `${properties},`;

  var q = `
    SELECT
        ${id} AS id,
        ${properties}
        ${geomj} AS geomj
    FROM ${req.query.table}
    WHERE
        ST_DWithin(
            ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326),
            ${geom}, 0.000001);`;

  var rows = await global.pg.dbs[layer.dbs](q);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

  res.code(200).send(Object.keys(rows).map(row => {
    let props = {};

    Object.keys(rows[row]).map(function (key) {
      if (key !== 'geomj') {
        props[key] = rows[row][key];
      }
    });

    return {
      type: 'Feature',
      geometry: JSON.parse(rows[row].geomj),
      properties: props || {
        id: rows[row].id
      }
    };
  }));
}