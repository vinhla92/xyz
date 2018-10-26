module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/cluster/select',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/cluster').select(req, res, fastify);
    }
  });
};