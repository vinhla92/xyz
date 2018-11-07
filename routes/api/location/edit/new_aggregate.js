module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/aggregate',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/edit').newAggregate(req, res, fastify);
    }
  });
};