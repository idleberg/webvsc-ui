const webpack = require('webpack');
const minifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
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
          presets: [
            ["env", {
              "targets": {
                "browsers": ["last 2 versions"]
              }
            }]
          ]
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