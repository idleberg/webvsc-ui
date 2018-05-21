'use strict';

// Dependencies
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano()
];

// cssnano
gulp.task('cssnano', (done) => {
  gulp.src('src/webvsc-ui.css')
  .pipe(postcss(plugins))
  .pipe(gulp.dest('dist/'));
  done();
});

// Webpack
gulp.task('webpack', (done) => {
  gulp.src('src/webvsc-ui.js')
  .pipe(webpackStream({config: require('./webpack.config.js')}, webpack))
  .pipe(gulp.dest('dist/'));
  done();
});

// Available tasks
gulp.task('build', gulp.parallel('cssnano', 'webpack', (done) => {
  done();
}));
