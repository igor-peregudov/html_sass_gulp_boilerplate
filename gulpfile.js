var gulp         = require('gulp'); // Подключаем Gulp
var sass         = require('gulp-sass'); //Подключаем Sass пакет,
var browserSync  = require('browser-sync'); // Подключаем Browser Sync
var concat       = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
var uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
var cssnano      = require('gulp-cssnano'); // Подключаем пакет для минификации CSS
var rename       = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
var del          = require('del'); // Подключаем библиотеку для удаления файлов и папок
var imageop      = require('gulp-image-optimization'); // Лучшая альтернатива gulp-imagemin (сжатие изображений)
var cache        = require('gulp-cache'); // Подключаем библиотеку кеширования
var autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
var uncss        = require('gulp-uncss'); // Удаление лишнего CSS
var notify       = require('gulp-notify'); // Оповещение об ошибках
var plumber      = require('gulp-plumber'); // Неубиваемый watch
var csscomb      = require('gulp-csscomb'); // Расческа для CSS



gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.scss') // Берем источник
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    message: err.message
                };
            })
        }))
        .pipe(sass({outputStyle: 'expanded'})) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(csscomb()) // Причесываем наш CSS
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src('app/libs/jquery/dist/jquery.min.js')// Берем jQuery (сюда добавлять другие js библиотеки)
        .pipe(concat('libs.min.js')) // Собираем библиотеки в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/libs/bootstrap/dist/css/bootstrap.css') // Выбираем файл для минификации (сюда добавлять другие CSS библиотеки)
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('uncss', function () {
    return gulp.src('app/css/*.css')    // Выбираем файлы для проверки CSS
        .pipe(uncss({
            html: ['app/*.html']    // Выбираем Html
        }))
        .pipe(gulp.dest('app/css'));    // Выбираем куда выгружать
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});


gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function(cb) {
    gulp.src('app/img/**/*')
        .pipe(cache(imageop({
            optimizationLevel: 10,
            progressive: true,
            interlaced: true
    })))
        .pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});


gulp.task('build', ['clean', 'sass', 'uncss', 'scripts', 'img'], function() {

    var buildCss = gulp.src('app/css/**/*.css') // Переносим CSS в продакшен
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clearcache', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);