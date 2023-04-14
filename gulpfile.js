// Основной модуль
import gulp from "gulp";
import browsersync from "browser-sync"; // Сообщения (подсказки)
import autoprefixer from "gulp-autoprefixer"; // Добовление вендорных префиксов
import cheerio from "gulp-cheerio";
import cleanCss from "gulp-clean-css"; // Сжатие CSS файла
import cssbeautify from "gulp-cssbeautify";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer"; // Проверка обнавлений
import notify from "gulp-notify"; // Сообщения (подсказки)
import plumber from "gulp-plumber"; // Обработка ошибок
import rename from "gulp-rename";
import replace from "gulp-replace"; // Поиск и замена
import gulpSass from "gulp-sass";
import dartSass from "sass";
import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import webp from "gulp-webp";
import webpack from "webpack-stream";
import { deleteAsync } from "del";

// Paths
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = `./docs`;
const srcFolder = `./src`;

const path = {
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    js: `${buildFolder}/js/`,
    images: `${buildFolder}/images/`,
    fonts: `${buildFolder}/fonts/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    js: `${srcFolder}/js/app.js`,
    images: `${srcFolder}/images/**/*.{svg,jpg,png,gif,ico,webp,webmanifest,xml,json}`,
    fonts: `${srcFolder}/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    images: `${srcFolder}/images/**/*.{svg,jpg,png,gif,ico,webp,webmanifest,xml,json}`,
    fonts: `${srcFolder}/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
};

// Tasks
const reset = () => {
  return deleteAsync(path.clean);
};

const server = () => {
  browsersync.init({
    server: {
      baseDir: `${path.build.html}`,
    },
    port: 3000,
  });
};

const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(
      plumber(
        notify.onError({
          title: "HTML",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(gulp.dest(path.build.html))
    .pipe(browsersync.stream());
};

const sass = gulpSass(dartSass);
const scss = () => {
  return gulp
    .src(path.src.scss)
    .pipe(
      plumber(
        notify.onError({
          title: "SCSS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    .pipe(gulp.dest(path.build.css))
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest(path.build.css))
    .pipe(browsersync.stream());
};

const js = () => {
  return gulp
    .src(path.src.js)
    .pipe(
      plumber(
        notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      webpack({
        mode: "production",
        output: {
          filename: "app.min.js",
        },
      })
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(browsersync.stream());
};

const images = () => {
  return gulp
    .src(path.src.images)
    .pipe(
      plumber(
        notify.onError({
          title: "IMAGES",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(imagemin())
    .pipe(newer(path.build.images))
    .pipe(webp())
    .pipe(gulp.dest(path.build.images))
    .pipe(gulp.src(path.src.images))
    .pipe(newer(path.build.images))
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 4, // 0 to 7
      })
    )
    .pipe(gulp.dest(path.build.images))
    .pipe(browsersync.stream());
};

const fonts = () => {
  return gulp
    .src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browsersync.stream());
};

const svgSpriteBuild = () => {
  return gulp
    .src("src/images/svg/*.svg")
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: ($) => {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            example: false,
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(gulp.dest("docs/images/"));
};

function watcher() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.fonts, fonts);
}

const mainTasks = gulp.parallel(html, scss, js, images, fonts);
const sprite = gulp.series(svgSpriteBuild);

// Построение сценариев выполнение задач
const dev = gulp.series(
  reset,
  sprite,
  mainTasks,
  gulp.parallel(watcher, server)
);

export { sprite };

// Выполнение сценария
gulp.task("default", dev);
