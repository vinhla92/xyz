module.exports = async (term, gazetteer) => {

  //https://www.mapbox.com/api-documentation/#search-for-places

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?`
        + `${gazetteer.code ? 'country=' + gazetteer.code : ''}`
        + `${gazetteer.bounds ? '&' + gazetteer.bounds : ''}`
        + '&types=postcode,district,locality,place,neighborhood,address,poi'
        + `&${global.KEYS[gazetteer.provider]}`;

  try {
    const response = await require('node-fetch')(url);

    if (response.status !== 200) return {err: 'Error fetching gazetteer results.'};

    const json = await response.json();
      
    return await json.features.map(f => ({
      label: `${f.text} (${f.place_type[0]}) ${!gazetteer.code && f.context ? ', ' + f.context.slice(-1)[0].text : ''}`,
      id: f.id,
      marker: f.center,
      source: 'mapbox'
    }));
      
  } catch (err) {
    Object.keys(err).forEach(key => !err[key] && delete err[key]);
    console.error(err);
    return {err: 'Error fetching gazetteer results.'};
  }

};