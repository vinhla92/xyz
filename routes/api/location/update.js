module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/update',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/edit').updateRecord(req, res, fastify);
    }
  });
};