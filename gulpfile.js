/**
 * @author  SonnY <andreasonny83@gmail.com>
 * @license MIT
 */
var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    del         = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    ftp         = require('vinyl-ftp'),
    minimist    = require('minimist'),
    gutil       = require('gulp-util'),
    Server      = require('karma').Server,
    args        = minimist(process.argv.slice(2));

// browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
  browserSync({
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

// start webserver from _build folder to check how it will look in production
gulp.task('serve:build', function(done) {
  return browserSync({
    server: {
      baseDir: './_build/'
    }
  }, done);
});

// reload all Browsers
gulp.task('bs-reload', function() {
  browserSync.reload();
});

// delete build folder
gulp.task('clean:build', function () {
  del([
    './_build/'
  ]);
});

// optimize images
gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe($.changed('./_build/images'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./_build/images'));
});

// copy fonts
gulp.task('fonts', ['iconfont'], function() {
  return gulp.src(['./src/fonts/carcassonne-scoreboard-font/*.*'])
    .pipe(gulp.dest('./_build/fonts/carcassonne-scoreboard-font'));
});

// copy base files
gulp.task('copy', function() {
  gulp
    .src([
      './src/*.*',
      './src/.htaccess',
      '!./src/index.html'
    ])
    .pipe(gulp.dest('./_build/'));
});

gulp.task('copy:prod', function() {
  // rename and uglify config.prod.js if present
  // otherwise use config.js
  gulp
    .src([
      './src/app/config.js',
      './src/app/config.prod.js'
    ])
    .pipe($.rename('config.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./_build/js/'));
});

// SASS task, will run when any SCSS files change
gulp.task('sass', function() {
  return gulp.src('./src/sass/main.scss')
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
  return gulp.src('./src/sass/main.scss')
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
    .pipe(gulp.dest('_build/css'));
});

gulp.task('version', function() {
  return gulp.src('./_build/js/templates.js')
    .pipe($.injectVersion())
    .pipe(gulp.dest('./_build/js/'));
});

// index.html build
// script/css concatenation
gulp.task('usemin', function() {
  var baseUrl = args.base_url ? args.base_url : '/';

  return gulp.src('./src/index.html')
    // add templates path
    .pipe($.htmlReplace({
        'templates': '<script type="text/javascript" src="js/templates.js"></script>',
        'base_url': '<base href="' + baseUrl + '">'
    }))
    .pipe($.usemin({
      css: [$.cssnano()],
      angularlibs: [$.uglify()],
      angularconfig: [],
      appcomponents: [$.uglify()],
      mainapp: [$.uglify()]
    }))
    .pipe(gulp.dest('./_build/'));
});

// make templateCache from all HTML files
gulp.task('templates', function() {
  return gulp.src([
    './src/app/**/*.html'
  ])
    .pipe($.htmlmin())
    .pipe($.angularTemplatecache({
      module: 'app',
      root: 'app'
    }))
    .pipe(gulp.dest('_build/js'));
});

gulp.task('iconfont', function() {
  var runTimestamp = Math.round(Date.now()/1000);

  return gulp.src(['./src/assets/icons/*.svg'])
    .pipe($.iconfont({
      fontName: 'carcassonne-scoreboard-font',
      appendUnicode: true,
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
gulp.task('default', ['fonts', 'browser-sync', 'sass'], function() {
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
 * Live deploy
 *
 * use with the followinf syntax:
 * gulp deploy --remote www.app.com --remote_path /public_html/carcassonne/ --base_url / --user username --password password
 *
 * where username and password are the ftp credentials
 */
gulp.task('deploy', function(callback) {
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
    'send',
    callback);
});

/**
 * Send all files through FTP
 */
gulp.task('send', function( cb ) {
  var remotePath = args.remote_path,
      conn = ftp.create({
      host: args.remote,
      user: args.user,
      password: args.password,
      log: gutil.log
      // parallel: 25,
      // debug: true,
      // idleTimeout: 200,
      // maxConnections: 30,
      // reload: true,
    });

  var globs = [
      '_build/**/*',
      '_build/.htaccess'
    ];

    return gulp.src( globs, {base: './_build/', buffer: true } )
      // .pipe( conn.differentSize( remotePath ) )
      .pipe( conn.newer( remotePath ) )
      .pipe( conn.dest( remotePath ) );
  //
  //   conn.rmdir( remotePath, function ( err ) {
  //     if ( err ) {
  //       // If the remote directory doesn't exisits, do nothing and continue with the upload
  //       // return cb( err );
  //     }
  //     gulp.src(globs, { base: './dist/', buffer: false } )
  //       .pipe( conn.newer( remotePath ) )
  //       .pipe( conn.dest( remotePath ) );
  // });
  //
});

/**
 * Run test once and exit
 */
gulp.task( 'test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
