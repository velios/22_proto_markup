const 	gulp           = require('gulp');
const 	gutil          = require('gulp-util' );
const 	sass           = require('gulp-sass');
const 	browserSync    = require('browser-sync');
const 	concat         = require('gulp-concat');
const 	uglify         = require('gulp-uglify');
const 	cleanCSS       = require('gulp-clean-css');
const 	rename         = require('gulp-rename');
const	  del            = require('del');
const 	imagemin       = require('gulp-imagemin');
const	  cache          = require('gulp-cache');
const	  autoprefixer   = require('gulp-autoprefixer');
const	  ftp            = require('vinyl-ftp');
const	  notify         = require("gulp-notify");
const	  rsync          = require('gulp-rsync');
const 	gcmq           = require('gulp-group-css-media-queries');
const   nunjucks       = require('gulp-nunjucks');
const   smartgrid      = require('smart-grid');

// ------------------------------------- Блок настроек -------------------------------------

const dir = {
  src: './app',
  static: './static',
  html: './'
};

const config = {
    js: {
        src : [
          dir.src + '/libs/jquery/dist/jquery.min.js',
          dir.src + '/libs/owl.carousel/dist/owl.carousel.js',
          dir.src + '/js/common.js', //всегда в конце
          ],
        dest: dir.static + '/js',
        result_name: 'scripts.min.js'
      },
    css: {
      smartgrid: dir.src + '/sass',
      sass: dir.src + '/sass/**/*.sass',
      dest: dir.static + '/css'
    },
    html: {
        jinja: [dir.src + '/jinja_templates/**/*.html',
                '!' + dir.src + '/jinja_templates/**/_*.*'], // не компилировать шаблоны начинающиеся с _*
        jinja_static_folder: '/22_proto_markup/static/', // только для публикации на GitHub
        //jinja_static_folder: 'static/', // раскоментировать для разработки на localhost
        dest: dir.dest + ''
    },
    img: {
        src: dir.src + '/img/**/*',
        dest: dir.dest + '/img'
    },
    libs: {
        libs: dir.src + '/libs'
    },
    smartgrid : {
        outputStyle: 'sass',
        filename: '_smartgrid',
        oldSizeStyle: false,
        columns: 12,
        offset: "30px",
        mobileFirst: false,
        container: {
            maxWidth: "1280px",
            fields: "30px"
        },
        breakPoints: {
            lg: {
                width: "1200px"
            },
            md: {
                width: "992px",
                fields: "15px"
            },
            sm: {
                width: "720px"
            },
            xs: {
                width: "576px"
            }
        },
        defaultMediaDevice: "screen"
    }
};

// --------------------------- Конец блока настроек ------------------------------------------------

gulp.task('js', function() {
    gulp.src(config.js.src)
        .pipe(concat(config.js.result_name))
        // .pipe(uglify()) // Минимизировать весь js (на выбор)
        .pipe(gulp.dest(config.js.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: dir.html
        },
        notify: false,
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

gulp.task('sass', function() {
     gulp.src(config.css.sass)
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(gcmq())
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS()) // Опционально, закомментировать при отладке
        .pipe(gulp.dest(config.css.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('jinja', function () {
  gulp.src(config.html.jinja)
    .pipe(nunjucks.compile({
      static: config.html.jinja_static_folder
    }))
    .pipe(gulp.dest(dir.html))
});

gulp.task('watch', ['smartgrid', 'sass', 'js', 'jinja', 'browser-sync'], function() {
    gulp.watch(config.css.sass, ['sass']);
    gulp.watch(['libs/**/*.js', dir.src + '/js/common.js'], ['js']);
    gulp.watch(config.html.jinja[0], ['jinja']);
    gulp.watch(dir.html + '/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
    gulp.src(config.img.src)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(config.static + config.img.dest));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

    var buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess',
    ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/main.min.css',
    ]).pipe(gulp.dest(config.static + config.css.dest));

    var buildJs = gulp.src([
        'app/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

    var conn = ftp.create({
        host:      'hostname.com',
        user:      'username',
        password:  'userpassword',
        parallel:  10,
        log: gutil.log
    });

    var globs = [
        'dist/**',
        'dist/.htaccess',
    ];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('smartgrid', function() {
    smartgrid(config.css.smartgrid, config.smartgrid);
});

gulp.task('rsync', function() {
    return gulp.src('dist/**')
        .pipe(rsync({
            root: 'dist/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }));
});

gulp.task('removedist', function() { return del.sync(dir.static); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
