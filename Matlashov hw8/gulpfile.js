var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var jade = require('gulp-jade');
var babel = require('gulp-babel');


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

gulp.task('babel', function(){
    return gulp.src('app/es2015/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['browserSync', 'sass', 'jade', 'babel'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/es2015/**/*.js', ['babel']);
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