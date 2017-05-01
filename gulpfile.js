var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html', 'src/*.css']
};


function initBrowserify() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
}

/*prod bundle*/

function prodBundle() {
    return initBrowserify()
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        /*.pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))*/
        .pipe(gulp.dest("dist"));
}


/*Dev bundle*/
var watchify = require("watchify");
var gutil = require("gulp-util");

var watchedBrowserify = watchify(initBrowserify().plugin(tsify));

function devBundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

/*dev Task*/
gulp.task("dev", ["copy-html-css"], devBundle);
watchedBrowserify.on("update", devBundle);
watchedBrowserify.on("log", gutil.log);

/*prod task */
gulp.task("default", ["copy-html-css"], prodBundle);

/*copy HTML task*/
gulp.task("copy-html-css", function() {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});