'use strict';
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var sassdoc     = require('sassdoc');
var sassGlob    = require('gulp-sass-glob');
var postcss     = require('gulp-postcss');
var postcssSVG  = require('postcss-svg');
var gutil       = require('gulp-util');
var a11y        = require('a11y');

var appConfig = {
  src: 'http://yourdev.url',
  theme: '',
  a11y: 'http://yourdev.url'
}

/* -------------------------------------- */
// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    // Use proxy instead of server for local dev with vagrant/mamp/wamp
    proxy: appConfig.src
  })
})


/* -------------------------------------- */
// gulp compile sass

gulp.task('sass', function() {
  var postcssProcessors;
  postcssSVG = require('postcss-svg');
  postcssProcessors = [
    postcssSVG({
      //defaults: '[fill]: black',
      paths: [appConfig.theme + 'images/'],
   })
  ];
 return gulp.src(appConfig.theme + 'sass/**/*.scss')
    .pipe(sassGlob())
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({ // Passes it through a gulp-sass
      /* include sass from the bower_components folder */
      includePaths: ['bower_components']
      //errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 3 versions', 'ie 9']
    }))
    .pipe(postcss(postcssProcessors))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(appConfig.theme + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


/* -------------------------------------- */
// Watch for file changes

gulp.task('watch', function () {
  gulp.watch(appConfig.theme + 'sass/**/*.scss', ['sass']);
  gulp.watch(appConfig.theme + 'js/**/*.js', browserSync.reload);
});


// Build Sequences
// ---------------
// ===============

// gulp - dev server + watch
gulp.task('default', function(callback) {
  runSequence(['sass'], 'browserSync', 'watch', callback);
});


// Additional useful tasks
// ---------------
// ===============

/* -------------------------------------- */
// Accessibility Task
// https://github.com/addyosmani/a11y

gulp.task('a11y', function() {
  a11y(appConfig.a11y, function(err, reports) {
    if (err) {
      gutil.log(gutil.colors.red('gulp a11y error: ' + err));
      return;
    }
    reports.audit.forEach(function(report) {
      if (report.result === 'FAIL') {
        gutil.log(displaySeverity(report), gutil.colors.red(report.heading), report.elements);
      }
    });
  });
});

function displaySeverity(report) {
  if (report.severity == 'Severe') {
    return gutil.colors.red('[' + report.severity + '] ');
  } else if (report.severity == 'Warning') {
    return gutil.colors.yellow('[' + report.severity + '] ');
  } else {
    return '[' + report.severity + '] ';
  }
}


/* -------------------------------------- */
// Task for running SassDoc

gulp.task('sassdoc', function () {
  var options = {
    dest: 'docs',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true,
    },
  };
  return gulp.src('app/sass/**/*.scss')
    .pipe(sassdoc(options));
});
