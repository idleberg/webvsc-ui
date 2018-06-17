'use strict';

// Dependencies
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

const plugins = [
    autoprefixer({browsers: ['last 5 versions']}),
    cssnano()
];

// cssnano
gulp.task('cssnano', (done) => {
  gulp.src('src/webvsc-ui.css')
  .pipe(postcss(plugins))
  .pipe(gulp.dest('dist/'));
  done();
});

// Available tasks
gulp.task('build', gulp.parallel('cssnano', (done) => {
  done();
}));
