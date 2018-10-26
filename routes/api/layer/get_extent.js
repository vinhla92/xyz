module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/layer/get_extent',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/layer').get_extent(req, res, fastify);
    }
  });
};