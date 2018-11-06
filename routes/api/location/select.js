module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {
      
      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };

      let
        layer = global.workspace[token.access].config.locales[req.query.locale].layers[req.query.layer],
        table = req.query.table,
        qID = layer.qID,
        id = req.query.id,
        geom = layer.geom,
        geomj = layer.geomj ? layer.geomj : `ST_asGeoJson(${geom})`,
        geomq = layer.geomq ? layer.geomq : geom,
        sql_filter = layer.sql_filter ? layer.sql_filter : '',
        infoj = JSON.parse(JSON.stringify(layer.infoj));

      // Check whether string params are found in the settings to prevent SQL injections.
      if ([table, qID, geomj, geomq]
        .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
        return res.code(406).send('Parameter not acceptable.');
      }

      if (sql_filter) {

        var rows = await global.pg.dbs[layer.dbs](`select ${sql_filter} from ${table} where ${qID} = $1;`, [id]);

        if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

        sql_filter = rows[0].sql_filter;

      }

      let access_filter = layer.access_filter && token.email && layer.access_filter[token.email.toLowerCase()] ?
        layer.access_filter[token.email] : null;

      let fields = '';

      infoj.forEach(entry => processInfoj(entry));
    
      function processInfoj(entry){

        if (!entry.type) return;

        if (entry.type === 'streetview') return;

        if (entry.type === 'group') return;
        
        if (entry.layer) {
          let entry_layer = global.workspace[token.access].config.locales[req.query.locale].layers[entry.layer];

          // For grids we want to use the highest resolution grid for the lookup.
          let tableArray = entry_layer.tables ? Array.from(Object.values(entry_layer.tables)) : null;

          // Get the last tableArray table name.
          let entry_table = tableArray ? tableArray[tableArray.length - 1] : null;

          fields += `
            (SELECT ${entry.field.split('.')[0]}(${entry.field.split('.')[1]})
            FROM ${entry_table || entry_layer.table}
            WHERE true ${sql_filter || `AND ST_Intersects(${entry_table || entry_layer.table}.${entry_layer.geom || 'geom'}, ${table}.${geomq})`}
            ${access_filter ? 'AND ' + access_filter : ''}
            ) AS "${entry.field}", `;
          return;
        }
        
        fields += `${entry.fieldfx || entry.field} AS ${entry.field}, `;
        
        // if (entry.subfield) fields += `${entry.subfield}::${entry.type} AS ${entry.subfield}, `;
      }

      let qLog = layer.log_table ?
        `( SELECT *, ROW_NUMBER() OVER (
            PARTITION BY ${layer.qID || 'id'}
            ORDER BY ((${layer.log_table.field || 'log'} -> 'time') :: VARCHAR) :: TIMESTAMP DESC ) AS rank
            FROM gb_retailpoint_editable_logs  AS logfilter`
        : null;

      q = `
      SELECT
          ${fields}
          ${geomj} AS geomj
      FROM ${layer.log_table ? qLog : table}
      WHERE 
      ${layer.log_table ? 'rank = 1 AND ' : ''}
      ${qID} = $1;`;

      rows = await global.pg.dbs[layer.dbs](q, [id]);

      if (rows.err) return res.code(500).send('soz. it\'s not you. it\'s me.');

      if (rows.length === 0) return res.code(401).send();

      // Iterate through the infoj object's entries and assign the values returned from the database query.
      Object.values(infoj).map(entry =>  setValues(rows, entry));

      function formatDate(str){
        let d = new Date(str),
          options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
          loc = 'en-GB';
        return d ? d.toLocaleDateString(loc, options) : false;
      }

      function formatDateTime(str){
        let d = new Date(str),
          options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
          loc = 'en-GB';
        return d ? d.toLocaleDateString(loc, options) + ', ' + d.toLocaleTimeString(loc) : false;
      }
    
      function setValues(rows, entry){ 
        if (rows[0][entry.field] || rows[0][entry.field] == 0) {

          if(entry.datetime){
            entry.value = formatDateTime(rows[0][entry.field]); 
            return;
          }

          if(entry.date){
            entry.value = formatDate(rows[0][entry.field]);
            return;
          }

          entry.value = rows[0][entry.field];
        }

        if (rows[0][entry.subfield]) {
          entry.subvalue = rows[0][entry.subfield];
        }
      }
    
      // Send the infoj object with values back to the client.
      res.code(200).send({
        geomj: rows[0].geomj,
        infoj: infoj
      });

    }
  });
};