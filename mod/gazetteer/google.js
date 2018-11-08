module.exports = async (term, gazetteer) => {

  //https://developers.google.com/places/web-service/autocomplete

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${term}`
          + `${gazetteer.code ? '&components=country:' + gazetteer.code : ''}`
          + `${gazetteer.bounds ? '&' + decodeURIComponent(gazetteer.bounds) : ''}`
          + `&${global.KEYS.GOOGLE}`;

  try {
    const response = await require('node-fetch')(url);
    const json = await response.json();

    if (json.error_message) return {err: json.error_message};

    return await json.predictions.map(f => ({
      label: f.description,
      id: f.place_id,
      source: 'google'
    }));

  } catch (err) {
    Object.keys(err).forEach(key => !err[key] && delete err[key]);
    console.error(err);
    return {err: 'Error fetching gazetteer results.'};
  }

};