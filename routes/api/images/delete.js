module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/images/delete',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/images').remove(req, res, fastify);
    }
  });
};