module.exports = fastify => {
  require('./client')(fastify);
  require('./proxy')(fastify);
  require('./auth/_auth')(fastify);
  require('./workspace/_workspace')(fastify);
  require('./api/_api')(fastify);
};