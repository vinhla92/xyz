module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/catchment',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {
      //require(global.appRoot + '/mod/catchment').catchment(req, res, fastify);
      const token = req.query.token ? fastify.jwt.decode(req.query.token) : { access: 'public' };
      
      MAPBOX_isochrones(req, res);
    
    }
  });
};

function MAPBOX_isochrones(req, res){
  let profile = req.body.profile,
    coordinates = req.body.coordinates,
    contours_minutes = req.body.minutes ? `contours_minutes=${req.body.minutes}` : '',  
    polygons = req.body.polygons ? '&polygons=true' : '',
    generalize = `&generalize=${req.body.minutes}`;

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