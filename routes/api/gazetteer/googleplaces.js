module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/gazetteer/googleplaces',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {

      var q = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.query.id}&${global.KEYS.GOOGLE}`;

      require('request').get(q, (err, response, body) => {
        if (err) {
          Object.keys(err).forEach(key => !err[key] && delete err[key]);
          return console.error(err);
        }

        // Parse response from Google places API request.
        let r = JSON.parse(body).result;

        // Sent point location back to client.
        res.code(200).send({
          type: 'Point',
          coordinates: [r.geometry.location.lng, r.geometry.location.lat]
        });
      });
    }
  });
};