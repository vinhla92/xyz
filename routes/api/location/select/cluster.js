module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/cluster/select',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      // require(global.appRoot + '/mod/cluster').select(req, res, fastify);

      const token = req.query.token ?
        fastify.jwt.decode(req.query.token) : { access: 'public' };
  
      let
        layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
        geom = layer.geom,
        table = req.query.table,
        id = layer.qID,
        filter = req.query.filter && JSON.parse(req.query.filter),
        label = layer.cluster_label ? layer.cluster_label : id,
        count = parseInt(req.query.count),
        lnglat = req.query.lnglat.split(',').map(ll => parseFloat(ll));
  
      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table, geom, id, label]
        .some(val => (typeof val === 'string' && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }
  
      let filter_sql = filter ? require(global.appRoot + '/mod/filters').legend_filter(filter) : '';
  
      // Query the feature count from lat/lng bounding box.
      var q = `
      SELECT
        ${id} AS ID,
        ${label} AS label,
        array[st_x(st_centroid(${geom})), st_y(st_centroid(${geom}))] AS lnglat
      FROM ${table}
      WHERE true 
        ${filter_sql} 
      ORDER BY ST_Point(${lnglat}) <#> ${geom} LIMIT ${count};`;
  
      var rows = await global.pg.dbs[layer.dbs](q);
  
      if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');
  
      res.code(200).send(Object.keys(rows).map(record => {
        return {
          id: rows[record].id,
          label: rows[record].label,
          lnglat: rows[record].lnglat
        };
      }));
    
    }
  });
};