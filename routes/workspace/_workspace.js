module.exports = fastify => {
  require('./get')(fastify);
  require('./admin')(fastify);
  require('./adminjson')(fastify);
  require('./save')(fastify);
};