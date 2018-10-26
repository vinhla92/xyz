module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/select_ll_nnearest',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/location').select_ll_nnearest(req, res, fastify);
    }
  });
};