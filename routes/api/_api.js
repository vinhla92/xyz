module.exports = fastify => {

  // layer

  require('./layer/get_extent')(fastify);

  require('./layer/mvt_get')(fastify);

  require('./layer/grid_get')(fastify);

  require('./layer/geojson_get')(fastify);

  require('./layer/cluster_get')(fastify);

  require('./layer/cluster_select')(fastify);

  // location

  require('./location/select')(fastify);

  require('./location/select_ll')(fastify);

  require('./location/select_ll_nearest')(fastify);

  require('./location/select_ll_intersect')(fastify);

  require('./location/new')(fastify);

  require('./location/update')(fastify);

  require('./location/delete')(fastify);

  require('./location/aggregate')(fastify);

  require('./location/catchment')(fastify);

  // gazetteer

  require('./gazetteer/autocomplete')(fastify);

  require('./gazetteer/googleplaces')(fastify);

  // images

  require('./images/new')(fastify);

  require('./images/delete')(fastify);

};