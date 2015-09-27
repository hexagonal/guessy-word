var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var browserify = require('browserify');
var transform = require('vinyl-transform');

var dist = './dist';
var port = 8080;
var baseUrl = 'http://localhost';

gulp.task('jsx', function() {
  return gulp.src('./src/**/*.jsx')
    .pipe(changed(dist, {extension: '.js'}))
    .pipe(react({harmony: true}))
    .pipe(gulp.dest(dist));
});

gulp.task('css', function() {
  return gulp.src('./src/**/*.css')
    .pipe(changed(dist))
    .pipe(gulp.dest(dist));
});

gulp.task('html', function() {
  return gulp.src('./src/**/*.html')
    .pipe(changed(dist))
    .pipe(gulp.dest(dist));
});

gulp.task('browserify', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.plugin('tsify').bundle();
  });

  return gulp.src(['./src/**/*.tsx'])
    .pipe(browserified)
    .pipe(gulp.dest(dist));
});

gulp.task('connect', function () {
  connect.server({
    root: ['dist'],
    port: port,
    base: baseUrl,
  });
});

gulp.task('default', ['browserify', 'css', 'html'], function() {});
