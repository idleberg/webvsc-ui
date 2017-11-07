const webpack = require('webpack');
// const BabiliPlugin = require('babili-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    // new BabiliPlugin(),
    new CopyWebpackPlugin([
      {
        from: './node_modules/bulma/css/bulma.css',
        to: './css/theme.css'
      }
    ])
  ]
};