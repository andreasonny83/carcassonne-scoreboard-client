/**
 * carcassonne-scoreboard-client
 *
 * @author    Andrea Sonny <andreasonny83@gmail.com>
 * @license   MIT
 *
 * https://andreasonny.mit-license.org/
 *
 */
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var del         = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var minimist    = require('minimist');
var gutil       = require('gulp-util');
var Server      = require('karma').Server;
var args        = minimist(process.argv.slice(2));

// browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
  return browserSync({
    server: {
      baseDir: "./src/"
    }
  });
});

// start webserver
gulp.task('serve', function(done) {
  return browserSync({
    server: {
      baseDir: './src/'
    }
  }, done);
});

// start webserver from dist folder to check how it will look in production
gulp.task('serve:dist', function(done) {
  return browserSync({
    server: {
      baseDir: './dist/'
    }
  }, done);
});

// reload all Browsers
gulp.task('bs-reload', function() {
  browserSync.reload();
});

// delete build folder
gulp.task('clean:build', function () {
  return del([
    './dist/'
  ]);
});

// delete source folder
gulp.task('clean:src', function () {
  return del([
    './src/',
    '*.js',
    '.*',
    '*.md',
    'LICENSE',
    'bower.json'
  ]);
});

// optimize images
gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe($.changed('./dist/images'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/images'));
});

// copy fonts
gulp.task('fonts', ['iconfont'], function() {
  return gulp.src(['./src/fonts/carcassonne-scoreboard-font/*.*'])
    .pipe(gulp.dest('./dist/fonts/carcassonne-scoreboard-font'));
});

// copy base files
gulp.task('copy', function() {
  return gulp
    .src([
      './src/*.*',
      './src/.htaccess',
      '!./src/index.html'
    ])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy:prod', function() {
  // rename and uglify config.prod.js if present
  // otherwise use config.js
  return gulp
    .src([
      './src/app/config.js',
      './src/app/config.prod.js'
    ])
    .pipe($.rename('config.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('move:dist', function() {
  // rename and uglify config.prod.js if present
  // otherwise use config.js
  return gulp
    .src([
      './dist/**/*',
    ])
    .pipe($.rename('config.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./'));
});

// SASS task, will run when any SCSS files change
gulp.task('sass', function() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      errLogToConsole: true
    }))
    .pipe($.sourcemaps.write('/'))
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({
      stream: true
    }))
    .pipe($.notify({
      message: 'Styles task complete'
    }));
});

// SASS Build task
gulp.task('sass:build', function() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'compact'
    }))
    .pipe($.autoprefixer('last 2 versions',
      'safari 6',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ))
    .pipe($.cssnano())
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write('/'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('version', function() {
  return gulp
    .src('./dist/js/templates.js')
    .pipe($.injectVersion())
    .pipe(gulp.dest('./dist/js/'));
});

// index.html build
// script/css concatenation
gulp.task('usemin', function() {
  var baseUrl = args.base_url ? args.base_url : '/';

  return gulp
    .src('./src/index.html')
    // add templates path
    .pipe($.htmlReplace({
        'templates': '<script type="text/javascript" src="js/templates.js"></script>',
        'base_url': '<base href="' + baseUrl + '">'
    }))
    .pipe($.usemin({
      css: [$.cssnano()],
      libs: [$.uglify()],
      angularlibs: [$.uglify()],
      angularconfig: [],
      appcomponents: [$.uglify()],
      mainapp: [$.uglify()]
    }))
    .pipe(gulp.dest('./dist/'));
});

// make templateCache from all HTML files
gulp.task('templates', function() {
  return gulp
    .src(['./src/app/**/*.html'])
    .pipe($.htmlmin())
    .pipe($.angularTemplatecache({
      module: 'app',
      root: 'app'
    }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('iconfont', function() {
  var runTimestamp = Math.round(Date.now()/1000);

  return gulp
    .src(['./src/assets/icons/*.svg'])
    .pipe($.iconfont({
      fontName: 'carcassonne-scoreboard-font',
      prependUnicode: true,
      normalize: true,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      timestamp: runTimestamp // recommended to get consistent builds when watching files
    }))
      .on('glyphs', function(glyphs, options) {
        // console.log(glyphs, options);
      })
    .pipe(gulp.dest('./src/fonts/carcassonne-scoreboard-font'));
});

// default task to be run with `gulp` command
// this default task will use Gulp to watch files.
gulp.task('serve', ['fonts', 'browser-sync', 'sass'], function() {
  gulp.watch('./src/css/*.css', function(file) {
    if (file.type === "changed") {
      reload(file.path);
    }
  });
  gulp.watch(['./src/index.html', './src/app/**/*.html'], ['bs-reload']);
  gulp.watch('./src/assets/icons/*.svg', ['fonts', 'bs-reload']);
  gulp.watch('./src/app/**/*.js', ['bs-reload']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

/**
 * build task
 */
gulp.task('build', function(callback) {
  runSequence(
    'clean:build',
    'copy',
    'sass:build',
    'fonts',
    'images',
    'templates',
    'usemin',
    'version',
    'copy:prod',
    callback);
});

/**
 * don't run locally, this will clean all your local files
 */
gulp.task('dist', function(callback) {
  runSequence(
    'build',
    'clean:src',
    'move:dist'
    callback);
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['serve']);
