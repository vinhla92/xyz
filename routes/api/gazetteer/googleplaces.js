module.exports = fastify => {
  fastify.route({
    method: 'GET',
    url: '/api/gazetteer/googleplaces',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: async (req, res) => {

      const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.query.id}&${global.KEYS.GOOGLE}`;

      try {
        const response = await require('node-fetch')(url);
        const json = await response.json();

        res.code(200).send({
          type: 'Point',
          coordinates: [json.result.geometry.location.lng, json.result.geometry.location.lat]
        });
    
      } catch (err) {
        Object.keys(err).forEach(key => !err[key] && delete err[key]);
        console.error(err);
        res.code(200).send({err: 'Error fetching from Google place API.'});
      }

    }
  });
};