module.exports = { get_extent };

async function get_extent(req, res, fastify) {

  const token = req.query.token ?
    fastify.jwt.decode(req.query.token) : { access: 'public' };

  let
    layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
    geom = layer.geom ? layer.geom : 'geom',
    table = layer.table || Object.values(layer.tables)[0];

  // Check whether string params are found in the settings to prevent SQL injections.
  if ([geom]
    .some(val => (typeof val === 'string' && global.workspace[token.access].values.indexOf(val) < 0))) {
    return res.code(406).send('Parameter not acceptable.');
  }

  rows = await global.pg.dbs[layer.dbs](`SELECT ST_EstimatedExtent('${table}','${geom}');`);

  if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

  let bounds = Object.values(Object.values(rows)[0])[0];

  if (!bounds) return res.code(401).send();

  res.code(200).send(/\((.*?)\)/.exec(bounds)[1].replace(/ /g,','));
}