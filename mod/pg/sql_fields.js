module.exports = async (fields, infoj, locale, table, geom) => {

  // Iterate through infoj and push individual entries into fields array.
  await infoj.forEach(entry => {

    if (entry.lookup) {
    
      // Get the lookup_layer object from the locale.
      const lookup_layer = locale.layers[entry.lookup.layer];
    
      // Get the lookup_table from either the lookup entry or the lookup_layer.
      const lookup_table = entry.lookup.table || lookup_layer.table || Object.values(lookup_layer.tables).pop();
    
      if (!lookup_table) return;
    
      // Get the lookup_geom from either the lookup entry or the lookup_layer.
      const lookup_geom = entry.lookup.geom || lookup_layer && lookup_layer.geom;
    
      if (!lookup_geom) return;

      if (entry.lookup.location_geom) geom = `${table}.${entry.lookup.location_geom}`;
    
      return fields.push(`(SELECT ${entry.lookup.function || 'SUM'}(${entry.field})
                FROM ${lookup_table}
                WHERE ${entry.lookup.condition || 'ST_INTERSECTS'}(${geom}, ${lookup_table}.${lookup_geom})
              ) AS "${entry.field}"`);
    
    }
    
    if (entry.field) return fields.push(`\n   ${entry.fieldfx || entry.field} AS ${entry.field}`);
    
  });

  return fields;

};