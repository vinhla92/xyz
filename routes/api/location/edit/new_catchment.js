module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/catchment',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async(req, res) => {
      
      const mapbox_isochrones = await require(global.appRoot + '/mod/mapbox_isochrones')(req.body);
      res.send(mapbox_isochrones);
    }
  });
};