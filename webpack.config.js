const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    library: 'Webvsc',
    libraryTarget: 'window',
    libraryExport: 'default',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
