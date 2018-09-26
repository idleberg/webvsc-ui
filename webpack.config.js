const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/webvsc-ui.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webvsc-ui.js',
    library: 'Webvsc',
    libraryTarget: 'window',
    libraryExport: 'default',
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },
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
