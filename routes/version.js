const pjson = require('/package.json');

module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/version',
    handler: async (req, res) => {

        res.send(pjson.version);

    }
  });
};