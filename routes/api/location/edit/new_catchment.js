module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/catchment',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => { MAPBOX_isochrones(req, res); }
  });
};

function MAPBOX_isochrones(req, res){

  if (!req.body.coordinates) return res.code(406).send('Invalid coordinates.');

  let profile = req.body.profile ? req.body.profile : 'driving', // driving mode by default
    coordinates = req.body.coordinates,
    contours_minutes = req.body.minutes ? `contours_minutes=${req.body.minutes}` : 'contours_minutes=10', // 10min drivetime if unset 
    polygons = '&polygons=true', // always return catchment as polygon
    generalize = req.body.minutes ? `&generalize=${req.body.minutes}` : '&generalize=10';

  let q = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${coordinates}?${contours_minutes}${polygons}&${global.KEYS.MAPBOX}${generalize}`;

  require('request').get(q, (err, response, body) => {
    if(err) {
      console.log('MAPBOX_isochrones:');
      console.error(err);
      return;
    }

    if(response.statusCode == 422){
      console.log('MAPBOX_isochrones:');
      console.log(JSON.parse(body).message);
      return;
    }

    res.code(200).send(JSON.parse(body));
  });
}