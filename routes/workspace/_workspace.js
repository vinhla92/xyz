module.exports = fastify => {
  require('./admin')(fastify);
  require('./adminjson')(fastify);
  require('./get')(fastify);
  require('./load')(fastify);
};