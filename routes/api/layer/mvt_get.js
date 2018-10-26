module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/mvt/get/:z/:x/:y',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/mvt').get(req, res, fastify);
    }
  });
};