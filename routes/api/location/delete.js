module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/location/delete',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      require(global.appRoot + '/mod/edit').deleteRecord(req, res, fastify);
    }
  });
};