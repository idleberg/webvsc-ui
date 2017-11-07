const webpack = require('webpack');
const minifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/assets',
    filename: 'js/app.js',
    publicPath: __dirname + '/assets'
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
   new minifyPlugin({
    "mangle": false
   })
  ]
};