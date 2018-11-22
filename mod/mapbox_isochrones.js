module.exports = async params => {
    
  if (!params.coordinates) return res.code(406).send('Invalid coordinates.');
    
  let profile = params.profile ? params.profile : 'driving', // driving mode by default
    coordinates = params.coordinates,
    contours_minutes = params.minutes ? `contours_minutes=${params.minutes}` : 'contours_minutes=10', // 10min drivetime if unset 
    polygons = '&polygons=true', // always return catchment as polygon
    generalize = params.minutes ? `&generalize=${params.minutes}` : '&generalize=10';
        
  let q = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${coordinates}?${contours_minutes}${polygons}&${global.KEYS.MAPBOX}${generalize}`;
    
  // Fetch results from Google maps places API.
  const fetched = await require(global.appRoot + '/mod/fetch')(q);

  if (fetched._err) return fetched;

  // Return results to route. Zero results will return an empty array.
  return await fetched;
};