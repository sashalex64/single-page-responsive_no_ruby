
var gulp = require('gulp'),
    sass = require('gulp-sass')
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    wait = require('gulp-wait'),
    path = require('path');
    
//   setting variables for later defining & use:
var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;
//  end of setting variables

env = 'development'; // defining env

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

jsSources = [
    'components/scripts/jqloader.js',
    'components/scripts/TweenMax.min.js',
    'components/scripts/jquery.scrollmagic.min.js',
    'components/scripts/script.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .on('error', gutil.log)
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('sass', function() {
  return gulp.src(sassSources)
      // .pipe(wait(100))
      .pipe(sass({
          outputStyle: 'expanded',
          includePaths: ['node_modules/susy/sass', 'node_modules/breakpoint-sass/stylesheets', 'node_modules/compass-mixins/lib']
          //succesfully included susy, breakpoint-sass and normalize
      }).on('error', sass.logError))
      // .pipe(autoprefixer())
      .pipe(gulp.dest(outputDir + 'css'))
      .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['sass']);
    gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

// Copy images to production
gulp.task('move', function() {
    gulp.src('builds/development/images/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
});

gulp.task('default', ['watch', 'html', 'js', 'sass', 'move', 'connect']);