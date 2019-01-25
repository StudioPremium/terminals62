"use strict";

/* параметры для gulp-autoprefixer */
var autoprefixerList = [
    'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];
/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    prodaction: {
        html:  'assets/prodaction/',
        js:    'assets/prodaction/js/',
        css:   'assets/prodaction/css/',
        img:   'assets/prodaction/img/',
        fonts: 'assets/prodaction/fonts/'
    },
    prodactionSrc: {
        html:  'assets/build/*.html',
        js:    ['assets/build/js/main.js', 'assets/build/js/critical.js'],
        css:   'assets/build/css/main.css',
        img:   'assets/build/img/**/*.*',
        fonts: 'assets/build/fonts/**/*.*'
    },
    prodactionClean:     './assets/prodaction',
    build: {
        html:  'assets/build/',
        js:    'assets/build/js/',
        css:   'assets/build/css/',
        img:   'assets/build/img/',
        fonts: 'assets/build/fonts/'
    },
    src: {
        html:  'assets/src/*.html',
        js:    ['assets/src/js/main.js', 'assets/src/js/critical.js'],
        style: 'assets/src/style/main.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*'
    },
    watch: {
        html:  'assets/src/**/*.html',
        js:    'assets/src/js/**/*.js',
        css:   'assets/src/style/**/**/*.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*'
    },
    clean:     './assets/build'
};
/* настройки сервера */
var config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    log = require('fancy-log'),
    critical = require('critical').stream,
    del = require('del'); // плагин для удаления файлов и каталогов

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});

// сбор html
gulp.task('html:build', function () {
    gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({stream: true})); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', function () {
    gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer({ // добавим префиксы
            browsers: autoprefixerList
        }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    gulp.src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// обработка картинок
gulp.task('image:build', function () {
    gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
		    imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
		])))
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// удаление каталога build 
gulp.task('clean:build', function () {
    del.sync(path.clean);
});

// сборка в продакш
// выявление критических стлей
/*
gulp.task('critical', function (cb) {
    critical.generate({
        inline: true,
        base: './assets/',
        src: 'build/index.html',
        dest: 'prodaction/index.html',
        minify: true,
        width: 1920,
        height: 1080
    });
});
*/

// удаление каталога prodaction 
gulp.task('clean:prodaction', function () {
    del.sync(path.prodactionClean);
});

gulp.task('critical', function() {
  return gulp
    .src('assets/build/*.html')
    .pipe(critical({base: 'assets/build/', inline: true, css: ['assets/build/css/main.css']}))
    .on('error', function(err) {
      log.error(err.message);
    })
    .pipe(gulp.dest('assets/prodaction'));
});

// перенос стилей из build в prodaction
gulp.task('css:prodaction', function () {
    gulp.src(path.prodactionSrc.css) // получим main.scss
        .pipe(gulp.dest(path.prodaction.css)); // выгружаем в prodaction
});

// перенос js из build в prodaction
gulp.task('js:prodaction', function () {
    gulp.src(path.prodactionSrc.js) // получим файл main.js
        .pipe(gulp.dest(path.prodaction.js));// положим готовый файл
});

// перенос шрифтов из build в prodaction
gulp.task('fonts:prodaction', function() {
    gulp.src(path.prodactionSrc.fonts)
        .pipe(gulp.dest(path.prodaction.fonts));
});

// перенос картинок из build в продакшн
gulp.task('image:prodaction', function () {
    gulp.src(path.prodactionSrc.img) // путь с исходниками картинок
        .pipe(gulp.dest(path.prodaction.img)); // выгрузка готовых файлов
});
// очистка кэша
gulp.task('cache:clear', function () {
  cache.clearAll();
});

// сборка
gulp.task('build', [
    'clean:build',
    'html:build',
    'css:build',
    'js:build',
    'fonts:build',
    'image:build'
]);
// продакшн
gulp.task('prodaction', [
    'clean:prodaction',
    'critical',
    'css:prodaction',
    'js:prodaction',
    'fonts:prodaction',
    'image:prodaction'
]);

// запуск задач при изменении файлов
gulp.task('watch', function() {
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.css, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
});

// задача по умолчанию
gulp.task('default', [
    'clean:build',
    'build',
    'webserver',
    'watch'
]);