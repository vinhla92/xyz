module.exports = fastify => {
  
  require('./login')(fastify);
  
  require('./register')(fastify);
  
  require('./token_api')(fastify);
  
  require('./token_renew')(fastify);

  require('./user_admin')(fastify);

  require('./user_approve')(fastify);

  require('./user_delete')(fastify);

  require('./user_update')(fastify);

  require('./user_verify')(fastify);
    
};