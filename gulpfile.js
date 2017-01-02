var gulp       = require('gulp');
var fs         = require("fs");
var gzip       = require('gulp-gzip');
var minifyCss  = require('gulp-minify-css');
var awspublish = require('gulp-awspublish');
var minifyHTML = require('gulp-minify-html');
var del        = require('del');

aws = JSON.parse(fs.readFileSync('./aws.json')); // reading aws config file
var publisher = awspublish.create(aws);
 
// defining single task with name "deploy"
gulp.task('deploy', function() {
  gulp.src('./app/*.js').pipe(gulp.dest('./dist/app'));
  gulp.src(['index.html', 'styles.css', 'systemjs.config.js']).pipe(gulp.dest('./dist'));
  gulp.src('./node_modules/**').pipe(gulp.dest('./dist/node_modules'));

/*  
  //minifying css
  gulp.src('./dist/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist'));

  //gzipping css
  gulp.src('./dist/*.css')
    .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(gulp.dest('./dist'));
  
  //minifying html
  gulp.src('./dist/*.html')
    .pipe(minifyHTML({ conditionals: true, spare:true}))
    .pipe(gulp.dest('./dist'));
    */

  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  // push all the contents of ./dist folder to s3
  gulp.src('./dist/**')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());

});

gulp.task('clean', function() {
    return del(['./dist/**']);
});

