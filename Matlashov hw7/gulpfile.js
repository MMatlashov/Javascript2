var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var jade = require('gulp-jade');

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
  }))
});

gulp.task('jade', function(){
  return gulp.src('app/jade/**/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('app'))
})

gulp.task('watch', ['browserSync', 'sass', 'jade'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('useref', function(){
  var assets = useref.assets();
  
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpIf('*.css', minifyCSS()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});