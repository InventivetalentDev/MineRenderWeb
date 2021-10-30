const fs = require("fs");
const path = require("path");

const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const glob = require('glob');
const rename = require('gulp-rename');
const es = require("event-stream");

const browserify = require('browserify');
const watchify = require('watchify');
const tsify = require('tsify');
const babelify = require('babelify');

function bundle(done, watch) {
    console.log(process.cwd())
    glob("./src/**/*.ts", function (err,files) {
        console.log(files);
        let tasks = files.map(function (file) {
            let bundler = browserify(file, Object.assign({}, watchify.args,
                {
                    cache: {},
                    packageCache: {},
                    debug: true
                }
            ))
                .plugin(tsify, {target: 'es6', project: 'tsconfig.json'})
                .transform(babelify, {
                    extensions: ['.tsc', '.ts', '.js'],
                    sourceMaps: true,

                })
            bundler.on('log', l => console.log(l));

            bundler.on('error', function (error) {
                console.error(error);
            });

            function rebundle() {
                console.log("bundling...")
                console.time("bundle")
                return bundler

                    .bundle()
                    .on('error', function (error) {
                        console.error(error);
                    })

                    .pipe(source(file))
                    .pipe(rename({
                        extname: '.bundle.js'
                    }))
                    .pipe(buffer())
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest('.'))

                    .on('end', function () {
                        console.timeEnd("bundle");
                        console.log("bundle done!")
                    });
            }

            if (watch) {
                // bundler = watchify(bundler);
                bundler.plugin(watchify)
                bundler.on('update', rebundle);
            }
            return rebundle()
        });
        es.merge(tasks).on('end', done);
    })
}

gulp.task('bundle', function (done) {
    return bundle(done, false);
});
gulp.task('bundle:w', function (done) {
    return bundle(done, true);
});
