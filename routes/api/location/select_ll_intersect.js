module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select_ll_intersect',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/location').select_ll_intersect(req, res, fastify);
    }
  });
};