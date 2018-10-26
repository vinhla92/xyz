module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/gazetteer/autocomplete',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/gazetteer').autocomplete(req, res, fastify);
    }
  });
};