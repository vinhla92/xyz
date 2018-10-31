module.exports = fastify => {
    fastify.route({
      method: 'POST',
      url: '/api/location/catchment',
      beforeHandler: fastify.auth([fastify.authAPI]),
      handler: (req, res) => {
        require(global.appRoot + '/mod/catchment').catchment(req, res, fastify);
      }
    });
};