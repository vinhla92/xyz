module.exports = async url => {

  try {
    const response = await require('node-fetch')(url);
    return await response.json();
    
  } catch (err) {
    Object.keys(err).forEach(key => !err[key] && delete err[key]);
    console.error(err);
    return {_err: 'Fetch from reessource failed.'};
  }

};