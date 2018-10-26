module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/images/new',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      var data = [];
      req.req.on('data', chunk => data.push(chunk));
      req.req.on('end', () => {
        req.body = Buffer.concat(data);
        require(global.appRoot + '/mod/images').save(req, res, fastify);
      });
    }
  });
};