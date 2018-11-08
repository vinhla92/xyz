module.exports = async (term, locale) => {

  for (let dataset of locale.gazetteer.datasets) {

    var q = `
    SELECT
      ${dataset.label} AS label,
      ${locale.layers[dataset.layer].qID} AS id,
      ST_X(ST_PointOnSurface(${locale.layers[dataset.layer].geom || 'geom'})) AS lng,
      ST_Y(ST_PointOnSurface(${locale.layers[dataset.layer].geom || 'geom'})) AS lat
      FROM ${dataset.table}
      WHERE ${dataset.qterm || dataset.label} ILIKE $1
      ORDER BY length(${dataset.label})
      LIMIT 10`;

    var rows = await global.pg.dbs[locale.layers[dataset.layer].dbs](q, [term + '%']);

    if (rows.err) return {err: 'Error fetching gazetteer results.'};

    if (rows.length > 0) return Object.values(rows).map(row => ({
      label: row.label,
      id: row.id,
      table: dataset.table,
      layer: dataset.layer,
      marker: `${row.lng},${row.lat}`,
      source: 'glx'
    }));

  }

  return [];
};