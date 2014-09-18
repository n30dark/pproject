/**
 * Gulp Buildfile
 *
 * By default, just running 'gulp' will create a dev build.
 * To create other build types, run:
 *
 *  - 'gulp --production' or 'gulp -p' => Create a production build with all JS concatted and minified
 *
 */

var BUILDTYPE_DEV = 'dev',
    BUILDTYPE_PRODUCTION = 'production';

// load our project config file
var pathsSrc  = 'frontend_src/',
    pathsDest = 'content/';

var config = {
    // src paths, which hold our js, scss and other things that need to be pre-processed
    src: {
        js:   pathsSrc + 'js/',
        sass: pathsSrc + 'sass/'
    },

    // destination paths (public folder)
    dest: {
        js:   pathsDest + 'js/',
        css:  pathsDest + 'css/',
        img:  pathsDest + 'img/',
        font: pathsDest + 'fonts/'
    },

    pattern: {
        sass: '**/*.scss',
        css:  '**/*.css',
        js:   '**/*.js'
    }
};

// and create some shortcuts
var gulp        = require('gulp'),
    util        = require('gulp-util'),
    browserify  = require('gulp-browserify'),
    cache       = require('gulp-cache'),
    rename      = require('gulp-rename'),
    imagemin    = require('gulp-imagemin'),
    jshint      = require('gulp-jshint'),
    livereload  = require('gulp-livereload'),
    mincss      = require('gulp-minify-css'),
    sass        = require('gulp-sass'),
    scsslint    = require('gulp-scss-lint'),
    uglify      = require('gulp-uglify');

// shortcut command: gulp --production, or shortcut gulp --p
var isProductionBuild = (util.env.production || util.env.p) ? true : false;

/**
 * Compile less into css
 * For a production build, first run css-vendor task
 */
gulp.task('css', ['sass'], function() {
    return gulp.src(config.dest.css + config.pattern.css)
        .pipe(isProductionBuild ? mincss() : util.noop())
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('lint-sass', function() {
    // Only lint production builds.
    if (!isProductionBuild) return;

    gulp.src(config.src.sass + config.pattern.sass)
        .pipe(scsslint());
});

gulp.task('sass', ['lint-sass'], function() {
    var options = {
        errLogToConsole: true,
        includePaths: [
            'bower_components/normalize-css/',
            'bower_components/bourbon/dist/'
        ],
        outputStyle: 'compressed'
    };

    if (!isProductionBuild) {
        options.sourceComments = 'map';
    }

    return gulp.src(config.src.sass + 'app.scss')
        .pipe(sass(options))
        .pipe(gulp.dest(config.dest.css));
});

/**
 *  For a development build, copy all js to the public folder.
 *  For a production build: concat and minify.
 */
gulp.task('js', ['jshint', 'js-head'], function() {
    return gulp.src(config.src.js + 'App.js')
        .pipe(browserify({
            debug: !isProductionBuild,
            shim: {
                jquery: {
                    path: 'bower_components/jquery/dist/jquery.js',
                    exports: '$'
                },
                modernizr: {
                    path: 'bower_components/modernizr/modernizr.js',
                    exports: 'Modernizr'
                },
                hammerjs: {
                    path: 'bower_components/hammerjs/hammer.js',
                    exports: 'Hammer'
                },
                tweenmax: {
                    path: 'bower_components/greensock/src/uncompressed/TweenMax.js',
                    exports: 'TweenMax'
                }
            }
        }))
        .pipe(rename('app.js'))
        .pipe(isProductionBuild ? uglify() : util.noop())
        .pipe(gulp.dest(config.dest.js));
});

/**
 * Concat and minify the JS that should go into the HTML head, e.g. Modernizr
 */
gulp.task('js-head', function() {
    var headSrc = [
            'bower_components/modernizr/modernizr.js'
        ];

    return gulp.src(headSrc)
        .pipe(uglify())
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('jshint', function() {
    // Only lint production builds.
    if (!isProductionBuild) return;

    return gulp.src(config.src.js + config.pattern.js)
        .pipe(jshint('.jshintrc'))
        .pipe(isProductionBuild ? jshint.reporter('fail') : jshint.reporter('default'));
});

/**
 * Image opimization
 */
gulp.task('images', function() {
    return gulp.src([config.src.img + '**/*', config.src.img + '*'])
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.dest.img));
});

gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch(config.src.sass + config.pattern.sass, ['css']);

    // Watch .js files
    gulp.watch(config.src.js + config.pattern.js, ['js']);

    var server = livereload();
    gulp.watch([
        config.dest.js + '*.js',
        config.dest.css + '*.css'
    ]).on('change', function(file) {
        server.changed(file.path);
    });
});

gulp.task('build-dev', ['css', 'js', 'images'], function() {
    util.log('Dev build complete. Starting watch...');

    gulp.start('watch');
});

gulp.task('build-production', ['css', 'js', 'images'], function() {

});

/**
 * Define our default task.
 */
gulp.task('default', function() {
    if (isProductionBuild) {
        gulp.start('build-' + BUILDTYPE_PRODUCTION);
    }
    else {
        gulp.start('build-' + BUILDTYPE_DEV);
    }
});
