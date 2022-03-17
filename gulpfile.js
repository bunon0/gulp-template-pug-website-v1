const gulp = require("gulp");
const mode = require("gulp-mode")({
  modes: ["production", "development"],
  default: "development",
  verbose: false,
});

const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob-use-forward");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssSorter = require("css-declaration-sorter");
const mergeMq = require("gulp-merge-media-queries");

const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const htmlBeatify = require("gulp-html-beautify");
const del = require("del");

const gulpEslint = require("gulp-eslint");
const gulpBabel = require("gulp-babel");
const gulpStylelint = require("gulp-stylelint");

const imageMin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");

const pug = require("gulp-pug");

const Src_Path = {
  scss: "./src/assets/scss/**/*.scss",
  js: "./src/assets/js/**/*.js",
  html: "./src/templates/**/*.html",
  pug: "./src/templates/**/*.pug",
  pugIgnore: "!./src/templates/**/_*.pug",
  images: "./src/assets/images/**/*",
};

const Dist_Path = {
  root: "./dist/",
  css: "./dist/assets/css/",
  js: "./dist/assets/js/",
  images: "./dist/assets/images/",
};

const compileSass = done => {
  gulp
    .src(Src_Path.scss, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(gulpStylelint({ reporters: [{ formatter: "string", console: true }] }))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssSorter()]))
    .pipe(mergeMq())
    .pipe(mode.development(gulp.dest(Dist_Path.css, { sourcemaps: "./sourcemaps" })))
    .pipe(mode.production(cleanCss()))
    .pipe(mode.production(gulp.dest(Dist_Path.css)));
  done();
};

const minJs = done => {
  gulp
    .src(Src_Path.js, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(gulpEslint({ useEslintrc: true }))
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failOnError())
    .pipe(
      gulpBabel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(mode.production(uglify()))
    .pipe(mode.development(gulp.dest(Dist_Path.js, { sourcemaps: "./sourcemaps" })))
    .pipe(mode.production(gulp.dest(Dist_Path.js)));
  done();
};

const compilePug = done => {
  gulp
    .src([Src_Path.pug, Src_Path.pugIgnore])
    .pipe(
      plumber({
        errorHandler: notify.onError({
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(Dist_Path.root));
  done();
};

const minImages = done => {
  gulp
    .src(Src_Path.images, {
      since: gulp.lastRun(minImages),
    })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(
      imageMin([
        imageMin.mozjpeg({ quality: 80 }),
        imageMin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
        imageMin.gifsicle({ optimizationLevel: 3 }),
        pngquant({
          quality: [0.65, 0.8],
          speed: 1,
        }),
      ])
    )
    .pipe(gulp.dest(Dist_Path.images));
  done();
};

const clean = done => {
  del(Dist_Path.root);
  done();
};

const browserInit = done => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: Dist_Path.root,
    },
  });
  done();
};

const browserReload = done => {
  browserSync.reload();
  done();
};

const watch = done => {
  gulp.watch(Src_Path.scss, { delay: 200 }, gulp.series(compileSass, browserReload));
  gulp.watch(Src_Path.js, { delay: 200 }, gulp.series(minJs, browserReload));
  gulp.watch(Src_Path.pug, { delay: 200 }, gulp.series(compilePug, browserReload));
  gulp.watch(Src_Path.images, { delay: 200 }, minImages);
  done();
};

exports.compileSass = compileSass;
exports.minJs = minJs;
exports.compilePug = compilePug;
exports.minImages = minImages;
exports.clean = clean;
exports.watch = watch;

exports.browserInit = browserInit;

exports.start = gulp.parallel(browserInit, watch);
exports.dev = gulp.parallel(compileSass, minJs, compilePug, minImages);
exports.build = gulp.parallel(compileSass, minJs, compilePug, minImages);
