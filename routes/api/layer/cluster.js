module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/layer/cluster',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      const locale = global.workspace[token.access].config.locales[req.query.locale];

      // Return 406 if locale is not found in workspace.
      if (!locale) return res.code(406).send('Invalid locale.');

      const layer = locale.layers[req.query.layer];

      // Return 406 if layer is not found in locale.
      if (!layer) return res.code(406).send('Invalid layer.');

      const table = req.query.table;

      // Return 406 if table is not defined as request parameter.
      if (!table) return res.code(406).send('Missing table.');
  
      let
        geom = layer.geom,
        cat = req.query.cat || null,
        size = req.query.size || 1,
        theme = req.query.theme,
        filter = req.query.filter && JSON.parse(req.query.filter),
        kmeans = parseInt(1 / req.query.kmeans),
        dbscan = parseFloat(req.query.dbscan),
        west = parseFloat(req.query.west),
        south = parseFloat(req.query.south),
        east = parseFloat(req.query.east),
        north = parseFloat(req.query.north);
  
      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table, cat]
        .some(val => (typeof val === 'string' && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Invalid parameter.');
      }
  

      // // Access filter
      // let access_filter = layer.access_filter && token.email && layer.access_filter[token.email.toLowerCase()] ?
      //   layer.access_filter[token.email] : null;


      // SQL filter
      const filter_sql = filter && await require(global.appRoot + '/mod/pg/sql_filter')(filter) || '';

      // // Set log table filter.
      // let qLog = layer.log_table ? `
      // ( SELECT *, ROW_NUMBER() OVER (
      //     PARTITION BY ${layer.qID}
      //     ORDER BY ((${layer.log_table.field || 'log'} -> 'time') :: VARCHAR) :: TIMESTAMP DESC ) AS rank
      //   FROM ${log_table}
      // ) AS logfilter` : null;
  

      // Query the feature count from lat/lng bounding box.
      var q = `
      SELECT
        count(1)::integer,
        ST_Distance(
          ST_Point(
            ST_XMin(ST_Envelope(ST_Extent(${geom}))),
            ST_YMin(ST_Envelope(ST_Extent(${geom})))
          ),
          ST_Point(
            ST_XMax(ST_Envelope(ST_Extent(${geom}))),
            ST_Ymin(ST_Envelope(ST_Extent(${geom})))
          )
        ) AS xExtent,
        ST_Distance(
          ST_Point(${west}, ${south}),
          ST_Point(${east}, ${north})
        ) AS xEnvelope
      FROM ${table}
      WHERE
        ST_DWithin(
          ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326),
            ${geom},
            0.00001)
        ${filter_sql};`;
  
      var rows = await global.pg.dbs[layer.dbs](q);
  
      if (rows.err) return res.code(500).send('Failed to query PostGIS table.');
  
      // return 202 if no locations found within the envelope.
      if (parseInt(rows[0].count) === 0) return res.code(202).send('No clusters found.');
  
      let
        count = rows[0].count,
        xExtent = rows[0].xextent,
        xEnvelope = rows[0].xenvelope;
  
      if (kmeans >= count) kmeans = count;
  
      if ((xExtent / xEnvelope) <= dbscan) kmeans = 1;
  
      dbscan *= xEnvelope;

      const kmeans_sql = `
      SELECT
        ${cat} AS cat,
        ${size} AS size,
        ST_ClusterKMeans(${geom}, ${kmeans}) OVER () kmeans_cid,
        ${geom}
      FROM ${table}
      WHERE
        ST_DWithin(
          ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326),
          ${geom}, 0.00001)
        ${filter_sql}`;
  

      if (!theme) q = `
      SELECT
        COUNT(geom) count,
        ST_AsGeoJson(ST_PointOnSurface(ST_Union(geom))) geomj

      FROM (
        SELECT
          kmeans_cid,
          ${geom} AS geom,
          ST_ClusterDBSCAN(${geom}, ${dbscan}, 1) OVER (PARTITION BY kmeans_cid) dbscan_cid

        FROM (${kmeans_sql}) kmeans

      ) dbscan GROUP BY kmeans_cid, dbscan_cid;`;

      if (theme === 'categorized') q = `
      SELECT
        COUNT(cat) count,
        SUM(size) size,
        array_agg(cat) cat,
        ST_AsGeoJson(ST_PointOnSurface(ST_Union(geom))) geomj

      FROM (
        SELECT
          cat,
          size,
          kmeans_cid,
          ${geom} AS geom,
          ST_ClusterDBSCAN(${geom}, ${dbscan}, 1) OVER (PARTITION BY kmeans_cid) dbscan_cid

        FROM (${kmeans_sql}) kmeans
          
        ) dbscan GROUP BY kmeans_cid, dbscan_cid;`;
  

      if (theme === 'competition') q = `
      SELECT
        SUM(count) count,
        SUM(size) size,
        JSON_Agg(JSON_Build_Object(cat, count)) cat,
        ST_AsGeoJson(ST_PointOnSurface(ST_Union(geom))) geomj

      FROM (
        SELECT
          COUNT(cat) count,
          SUM(size) size,
          cat,
          ST_Union(geom) geom,
          kmeans_cid,
          dbscan_cid

        FROM (
          SELECT
            cat,
            size,
            kmeans_cid,
            ${geom} AS geom,
            ST_ClusterDBSCAN(${geom}, ${dbscan}, 1) OVER (PARTITION BY kmeans_cid) dbscan_cid

          FROM (${kmeans_sql}) kmeans
          
        ) dbscan GROUP BY kmeans_cid, dbscan_cid, cat

      ) cluster GROUP BY kmeans_cid, dbscan_cid;`;


      if (theme === 'graduated') q = `
      SELECT
        COUNT(${geom}) count,
        SUM(size) size,
        SUM(cat) sum,
        ST_AsGeoJson(ST_PointOnSurface(ST_Union(geom))) geomj

      FROM (
        SELECT
          cat,
          size,
          kmeans_cid,
          ${geom} AS geom,
          ST_ClusterDBSCAN(${geom}, ${dbscan}, 1) OVER (PARTITION BY kmeans_cid) dbscan_cid

        FROM (${kmeans_sql}) kmeans

      ) dbscan GROUP BY kmeans_cid, dbscan_cid;`;
  
      var rows = await global.pg.dbs[layer.dbs](q);
      
      if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');
  
      if (!theme) res.code(200).send(Object.keys(rows).map(record => {
        return {
          type: 'Feature',
          geometry: JSON.parse(rows[record].geomj),
          properties: {
            count: parseInt(rows[record].count)
          }
        };
      }));

      if (theme === 'categorized') res.code(200).send(rows.map(row => {
        return {
          type: 'Feature',
          geometry: JSON.parse(row.geomj),
          properties: {
            count: parseInt(row.count),
            cat: row.cat.length === 1? row.cat[0] : null
          }
        };
      }));

      if (theme === 'competition') res.code(200).send(Object.keys(rows).map(record => {
        return {
          type: 'Feature',
          geometry: JSON.parse(rows[record].geomj),
          properties: {
            count: parseInt(rows[record].count),
            cat: Object.assign({}, ...rows[record].cat)
          }
        };
      }));
  

      if (theme === 'graduated') res.code(200).send(Object.keys(rows).map(record => {
        return {
          type: 'Feature',
          geometry: JSON.parse(rows[record].geomj),
          properties: {
            count: parseInt(rows[record].count),
            size: parseInt(rows[record].size),
            sum: parseFloat(rows[record].sum)
          }
        };
      }));

    }
  });
};