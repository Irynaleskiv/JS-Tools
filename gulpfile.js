var gulp = require('gulp'),
  autoprefixer = require("gulp-autoprefixer"),
  babel = require('gulp-babel'),
  concat = require("gulp-concat"),
  minifyCSS = require("gulp-csso"),
  jshint = require("gulp-jshint"),
  less = require('gulp-less'),
  uglify = require("gulp-uglify"),
  debug = require("gulp-debug"),
  del = require("del"),
  browserSync = require('browser-sync').create();

// task for editing css files
gulp.task('css', function() {
  return gulp.src('./main/folder1/styles/*.less')
    .pipe(debug({
      title: 'src'
    }))
    //remake *.less to *.css
    .pipe(less())
    .pipe(debug({
      title: 'less'
    }))
    //added prefixes
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie6',
      'ie7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(debug({
      title: 'autoprefixer'
    }))
    //concatenated all css files to one file
    .pipe(concat('styles.css'))
    .pipe(debug({
      title: 'concat'
    }))
    //minify styles.css file
    .pipe(minifyCSS())
    .pipe(debug({
      title: 'minify'
    }))
    .pipe(gulp.dest('./main/folder2/css'))
    .pipe(browserSync.stream());
});

// task for editing js files
gulp.task("js", function() {
  return gulp.src("./main/folder1/script/*.js")
    .pipe(debug({
      title: 'src'
    }))
    //added hints
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(debug({
      title: 'jshint'
    }))
    //es6 -> es5
    .pipe(babel({
      'presets': ['es2015']
    }))
    //concatenated all js files to one file
    .pipe(concat('app.js'))
    .pipe(debug({
      title: 'concat'
    }))
    //uglify app.js file
    .pipe(uglify())
    .pipe(debug({
      title: 'uglify'
    }))
    .pipe(gulp.dest("./main/folder2/js"))
});

// task for watching after js files
gulp.task('js-watch', ['js'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('server', ['css', 'js'], function() {
  browserSync.init({
    server: {
      baseDir: './main/folder2'
    }
  })

  gulp.watch('main/folder1/styles/*.less', ['css']);
  gulp.watch('main/folder1/script/*.js', ['js-watch']);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// task for deleting a 'prod' folder with all files inside
gulp.task('del', ['server'], function() {
  return del('prod')
});

// task for creating a "prod" folder & adding files inside it from "folder2"
gulp.task('copy', ['del'], function() {
  return gulp.src("./main/folder2/**")
    .pipe(gulp.dest("prod"))
});

gulp.task('prod', ['del', 'copy']);

gulp.task('default', ['prod']);