module.exports = { catchment };

async function catchment(req, res, fastify){
    const token = req.query.token ?
     fastify.jwt.decode(req.query.token) : { access: 'public' };

     //console.log(token);
     //console.log(JSON.stringify(req.body));

     MAPBOX_isochrones(req, res);
}

function MAPBOX_isochrones(req, res){
    let profile = req.body.profile,
        coordinates = req.body.coordinates,
        contours_minutes = req.body.minutes ? `contours_minutes=${req.body.minutes}` : ``,  
        polygons = req.body.polygons ? `&polygons=true` : ``;

    var q = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${coordinates}?${contours_minutes}${polygons}&${global.KEYS.MAPBOX}`;

    console.log(q);
}