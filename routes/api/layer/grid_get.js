module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/grid/get',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/grid').get(req, res, fastify);
    }
  });
};