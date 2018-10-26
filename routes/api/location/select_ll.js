module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select_ll',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/location').select_ll(req, res, fastify);
    }
  });
};