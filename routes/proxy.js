module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/proxy/image',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      const uri = `${req.query.uri}${req.query.size?'&size='+req.query.size+'&':''}${global.KEYS[req.query.provider]}`;
      res.send(require('request')(uri));
    }
  });
};