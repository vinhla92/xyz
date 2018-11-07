module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/geojson/get',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/geojson').get(req, res, fastify);
    }
  });
};