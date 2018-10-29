module.exports = { catchment };

async function catchment(req, res, fastify){
    //const token = req.query.token ?
     //fastify.jwt.decode(req.query.token) : { access: 'public' };

     console.log(JSON.stringify(req.body));
}