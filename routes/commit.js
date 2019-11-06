const rev = fs.readFileSync('.git/HEAD').toString();

if (rev.indexOf(':') === -1) {

} else {

    rev = fs.readFileSync('.git/' + rev.substring(5)).toString();
}

module.exports = fastify => {
    fastify.route({
      method: 'GET',
      url: '/commit',
      handler: async (req, res) => {
  
          res.send(rev);
  
      }
    });
  };