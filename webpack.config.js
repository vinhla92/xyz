const path = require('path');

module.exports = {
  entry: {
    xyz_ui: ['./public/js/xyz_ui.js'],
    xyz_openlayers: ['./public/js/xyz_openlayers/index.mjs'],
    xyz_leaflet: ['./public/js/xyz_leaflet/index.mjs']
  },
  output: {
    path: path.resolve(__dirname, 'public/js/build'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/
    }]
  },
  optimization: {
    concatenateModules: true
  },
  // stats: {
  //   optimizationBailout: true,
  //   maxModules: Infinity
  // }
};