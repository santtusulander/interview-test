'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require("browserify");
var babelify = require("babelify");
var path = require('path');
var source = require('vinyl-source-stream');
var eslint = require('gulp-eslint');
var server = require('gulp-webserver');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

var entry   = path.join(__dirname, './scripts/app.es6');
var bundler = browserify(entry);

bundler = bundler.transform(babelify, {presets: ["es2015", "react"]});

function bundle() {
  var stream = bundler.bundle().pipe(source('app.js'));

  stream = stream.pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write());

  stream = stream.pipe(gulp.dest('dist'));
  return stream;
}

gulp.task('build-js', bundle);

gulp.task('build-css', function () {
  return gulp.src('./styles/app.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build-css', 'build-js']);

gulp.task('serve', ['build'], function() {
  return gulp.src('.').pipe(server({
    port:       9001,
    host:       '0.0.0.0',
    fallback:   'index.html',
    livereload: true
  }));
});

gulp.task('default', ['serve'], function() {
  gulp.watch('./styles/*.sass', [ 'build-css' ]);
  gulp.watch('./scripts/*.es6', [ 'build-js' ]);

});