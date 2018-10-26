module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/location').select(req, res, fastify);
    }
  });
};