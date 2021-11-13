// FROM GULP
const { src, dest, watch, series, parallel } = require("gulp");
// ALL PACKAGES
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const sourceMaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const cssMinify = require("gulp-clean-css");
const prefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
require("imagemin-mozjpeg");
require("imagemin-optipng");
const webp = require("gulp-webp");
const server = require("browser-sync").create();
const gulpClean = require("gulp-clean");
const babel = require("gulp-babel");
const pugEngine = require("gulp-pug");
const rollup = require("@rollup/stream");
const rollupBabel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const purgecss = require("gulp-purgecss");
const postcss = require("gulp-postcss");

///////////////////////////////////
//// SRC & DEST
// DIR
const dir = {
  src: "./",
  dest: "./dist/",
};

// SRC
///////////////////////////////////
const SRC_FOLDER = {
  styleSass: "./src/css/sass/style.scss",
  styleSassWatch: "./src/css/sass/**/*.scss",
  styleTailwind: "./src/css/tailwind/style.css",
  //
  js: "./src/js/**/*.js",
  pug1: "./src/html/*.pug",
  pug2: "./src/html/**/*.pug",
  html: "./src/html/*.html",
  img: "./dist/assets/img/**/*",
  jsModule: "./src/js/app.js",
};

///////////////////////////////////
// DEST
const DEST_FOLDER = {
  style: `${dir.dest}assets/css`,
  js: `${dir.dest}assets/js`,
  pug: dir.dest,
  img: `${dir.dest}assets/img`,
};

///////////////////////////////////
// PRODUCTION
const DEST_FOLDER_PRO = {
  style: `${DEST_FOLDER.style}/*.css`,
  js: `${DEST_FOLDER.js}/*.js`,
  html: "dist/**/*.html",
};

///////////////////////////////////
//// TASKS
/// STYLE
// TASK - DEVELOPMENT
const styleDev = (run) => {
  //
  if (run === "sass") {
    return (
      src(SRC_FOLDER.styleSass)
        .pipe(
          plumber(function (error) {
            console.log("Style Task Error");
            console.log(error);
            this.emit("end");
          })
        )
        .pipe(sourceMaps.init())
        // .pipe(concat("style.css"))
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(dest(DEST_FOLDER.style))
    );
  }
  //
  if (run === "tailwind") {
    return src("./src/css/tailwind/style.css")
      .pipe(
        plumber(function (error) {
          console.log("Style Task Error");
          console.log(error);
          this.emit("end");
        })
      )
      .pipe(postcss())
      .pipe(dest(DEST_FOLDER.style));
  }
};
// TASK - PRODUCTION
const styleProd = () => {
  //
  return src(DEST_FOLDER_PRO.style)
    .pipe(
      purgecss({
        content: [DEST_FOLDER_PRO.html, "./dist/assets/js/**/*.js"],
      })
    )
    .pipe(prefixer())
    .pipe(cssMinify())
    .pipe(rename("style.css"))
    .pipe(dest(DEST_FOLDER.style));
};

/// JAVASCRIPT
// TASK - DEVELOPMENT
const jsDev = () => {
  return src(SRC_FOLDER.js)
    .pipe(
      plumber(function (error) {
        console.log("Javascript Task Error");
        console.log(error);
        this.emit("end");
      })
    )
    .pipe(sourceMaps.init())
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(concat("main.js"))
    .pipe(sourceMaps.write())
    .pipe(dest(DEST_FOLDER.js));
};
// TASK - PRODUCTION
const jsProd = () => {
  return src(DEST_FOLDER_PRO.js)
    .pipe(uglify())
    .pipe(gulpClean())
    .pipe(rename("main.js"))
    .pipe(dest(DEST_FOLDER.js));
};
// TASK - JS MODULE
const jsDevModule = () => {
  return rollup({
    input: SRC_FOLDER.jsModule,
    plugins: [commonjs(), nodeResolve()],
    output: { sourcemap: true },
    // cache: cache,
    format: "iife",
  })
    .on("bundle", function (bundle) {
      // Update cache data after every bundle is created
      cache = bundle;
    })
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourceMaps.init({ loadMaps: true }))
    .pipe(sourceMaps.write())
    .pipe(dest(DEST_FOLDER.js));
};

/// TASK - PUG
const pug = () => {
  return src(SRC_FOLDER.pug1)
    .pipe(pugEngine({ pretty: true }))
    .pipe(dest(DEST_FOLDER.pug));
};

/// TASK - HTML
const html = () => {
  return src(SRC_FOLDER.html).pipe(dest(DEST_FOLDER.pug));
};

// TASK - MINIFICATION IMAGES
const imageMin = () => {
  return src(SRC_FOLDER.img)
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 50, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(DEST_FOLDER.img));
};

// TASK - CONVERT TO WEBP
const imageWebp = () => {
  return src(SRC_FOLDER.img)
    .pipe(gulpClean())
    .pipe(webp())
    .pipe(dest(DEST_FOLDER.img));
};

///////////////////////////////////
// RELOAD SERVER
async function reload() {
  server.reload();
}

///////////////////////////////////
//// WATCH TASKS
const watcher = async () => {
  // SERVER
  await server.init({
    server: {
      baseDir: dir.dest,
    },
    port: 5000,
  });
  console.log("Watch Running...");
  // 1) - WATCH STYLE
  watch(
    [
      SRC_FOLDER.styleSassWatch,
      SRC_FOLDER.styleTailwind,
      "./tailwind.config.js",
    ],
    parallel(styleDev.bind(this, "sass"), reload)
  );
  // 2) - WATCH JAVASCRIPT
  watch(SRC_FOLDER.js, parallel(jsDev, reload));
  // 3) - WATCH PUG
  // watch(SRC_FOLDER.pug2, parallel(pug, reload));
  // 4) - WATCH HTML
  watch(SRC_FOLDER.html, parallel(html, reload));
  // 5) - WATCH IMAGES
  watch(`${SRC_FOLDER.img}{png,jpeg,jpg}`, { events: "add" }, imageWebp);
  // 6) - WATCH USE JAVASCRIPT MODULE
  // watch(SRC_FOLDER.js, parallel(jsDevModule, reload));
};
///////////////////////////////////
// EXPORTS
// DEFAULT
exports.default = series(
  html,
  imageWebp,
  styleDev.bind(this, "sass"),
  jsDev,
  watcher
);

// BUILD
exports.build = series(styleProd, jsProd);
