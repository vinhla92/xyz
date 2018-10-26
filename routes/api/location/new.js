module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/new',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/edit').newRecord(req, res, fastify);
    }
  });
};