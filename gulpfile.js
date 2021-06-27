const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const pug = require('gulp-pug');

function templates () {
    return src('./templates/main.pug')
        .pipe(pug())
        .pipe(concat('index.html'))
        .pipe(dest('./'));
}

function styles () {
    return src('./sass/style.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'], grid: true
        }))
        .pipe(dest('./css/'))
        .pipe(browserSync.stream())
}

function scripts () {
    return src([
        './js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('./js'))
    .pipe(browserSync.stream());
}

function images () {
    return src('./images/**/*')
        // .pipe(imagemin())
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}

function cleanDist () {
    return del('dist');
}

function browsersync () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
}

function build () {
    return src([
        './css/style.min.css',
        './js/main.min.js',
        './*.html'
    ], {base: './'})
    .pipe(dest('dist'))
}

function watching () {
    watch(['./sass/**/*.sass'], styles);
    watch(['./js/**/*.js', '!./js/main.min.js'], scripts);
    watch(['./templates/**/*.pug'], templates);
    watch(['./*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.scripts = scripts;
exports.cleandist = cleanDist;
exports.images = images;
exports.templates = templates;
exports.build = series(cleanDist, images, build);
exports.browsersync = browsersync;
exports.default = parallel(styles, scripts, templates, browsersync, watching);