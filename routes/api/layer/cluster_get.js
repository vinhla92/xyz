module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/cluster/get',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/cluster').get(req, res, fastify);
    }
  });
};