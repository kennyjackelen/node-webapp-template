/*jshint node:true*/
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var revAll = require('gulp-rev-all');
var del = require('del');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('clean', function() {
  return del('./app/dist');
});

gulp.task('browserify', function() {
  return browserify('./app/src/js/entry.js')
    .bundle()
    .pipe( source('app.js') )
    .pipe( gulp.dest('./app/dist/js') );
});
 
gulp.task('sass', function () {
  return gulp.src('./app/src/scss/entry.scss')
    .pipe( sass().on('error', sass.logError ) )
    .pipe( rename('app.css') )
    .pipe( gulp.dest('./app/dist/css') );
});

gulp.task('copy', function() {
  return gulp.src('./app/src/index.html')
    .pipe(gulp.dest('./app/dist'));
});

gulp.task('rev', function() {
  var RevAll = new revAll( { dontRenameFile: [ /^\/index.html/g ] } );
  return gulp.src('./app/dist/**')
    .pipe( RevAll.revision() )
    .pipe( gulp.dest('./app/dist') );

});

gulp.task('browserify-rev', function() {
  runSequence('browserify','copy-rev');
});

gulp.task('sass-rev', function() {
  runSequence('sass','copy-rev');
});

gulp.task('copy-rev', function() {
  runSequence('copy','rev');
});

gulp.task('watch', ['default'], function() {
  gulp.watch('app/src/**/*.js', ['browserify-rev']);
  gulp.watch('app/src/**/*.scss', ['sass-rev']);
  gulp.watch('app/src/**/*.html', ['copy-rev']);
});

gulp.task('default', function( callback ) {
  runSequence('clean',
              ['browserify', 'sass', 'copy'],
              'rev',
              callback);
});
