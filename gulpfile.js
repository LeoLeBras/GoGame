/**
 * Léo Le Bras
 * http://leolebras.com/
 *
 * Work with Gulp
 * http://gulpjs.com/
 *
 * Copyright 2014 - 2015
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creative : 2014-04-01
 * Last updated: 2015-11-05
 */



/**
 * Import dependencies
 *
 */

var autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    base64 = require('gulp-base64'),
    browserify = require('gulp-browserify'),
    browserSync = require('browser-sync'),
    clean = require('gulp-rimraf'),
    cssbeautify = require('gulp-cssbeautify'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    inlinesource = require('gulp-inline-source'),
    otf2ttf = require('otf2ttf');
    minifyCSS = require('gulp-minify-css'),
    pngcrush = require('imagemin-pngcrush'),
    pngquant = require('imagemin-pngquant'),
    pxtorem = require('gulp-pxtorem'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    ttf2woff = require('gulp-ttf2woff'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip');

var reload = browserSync.reload;





/* ------------------------------------- */






/**
 * Set autoprefixer
 *
 * @var string
 */

var prefix = {
     browsers: ["last 1 version", "> 1%", "ie 8"]
};

    



/**
 * Config dir folders
 *
 * @var strings
 */

var srcDir =  __dirname + '/src/';
var buildDir = './build/';
var distDir = __dirname + '/dist/';

var cssDir = 'css/';
var imgDir = 'img/';
var jsDir = 'js/';
var sassDir = 'sass/';
var fontsDir = 'fonts/';




/* ------------------------------------- */





/**
 * Sync modifications
 *
 * @with  browser-sync
 */

var reload = browserSync.reload;

gulp.task('browser_sync', function(){
   browserSync({
       server: {
           baseDir: buildDir
       }
   });
});






/**
 * Compile Sass
 *
 * @with  gulp-sourcemaps gulp-sass gulp-minify-css gulp-sourcemaps gulp-cssbeautify
 * @return CSS
 */

gulp.task('sass', function(){
   gulp.src([srcDir + 'sass/*.scss'])
       .pipe(sourcemaps.init())
       .pipe(sass({
            includePaths: [
                srcDir + sassDir,
            ]
        }))
       .on('error', function (err) {
           console.log(err.message);
       })
       .pipe(autoprefixer(prefix))
       .pipe(pxtorem({
          prop_white_list: [
            'font-size', 'line-height', 'letter-spacing', 'margin', 
            'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding',
            'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'width',
            'height'
          ],
          media_query: true
        }))
       .pipe(minifyCSS({keepSpecialComments: 0}))
       .pipe(cssbeautify())
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(buildDir + cssDir))
       .pipe(reload({stream: true}));
});






/**
 * Compile ES6+ syntax in ES5
 *
 * @with babelify and gulp-gutil
 * @return js
 */

gulp.task('js', function () {
   gulp.src([srcDir + jsDir + 'app/librairies/*.js', srcDir + jsDir + 'app/**/*.js', srcDir + jsDir + 'index.js'])
      .pipe(concat('index.js'))
      .pipe(babel({
        stage: 0,
      }))
      .on('error', gutil.log)
      .pipe(gulp.dest(buildDir + jsDir))
      .pipe(reload({stream: true}));

   gulp.src([srcDir + jsDir + 'app/librairies/*.js', srcDir + jsDir + 'app/**/*.js', srcDir + jsDir + 'index.js'])
      .pipe(concat('index.es6.js'))
      .pipe(gulp.dest(buildDir + jsDir));
});






/**
 * Minify images
 *
 * @with  gulp-imagemin imagemin-pngcrush imagemin-pngquant
 * @return images
 */

gulp.task('img', function(){
   gulp.src([srcDir + imgDir + '**'])
       .pipe(imagemin({
           progressive: true,
           svgoPlugins: [],
           use: [pngquant()]
       }))
       .pipe(gulp.dest(buildDir + imgDir))
       .pipe(reload({stream: true}));
});








/**
 * Copy Paste .html files
 *
 * @return html
 */

gulp.task('html', function(){
   gulp.src(srcDir + '*.html')
      .pipe(inlinesource())
      .pipe(gulp.dest(buildDir))
      .pipe(reload({stream: true}));
});








/**
 * Copy Paste vendors files
 *
 * @return files copy
 */

gulp.task('vendors', function(){
   gulp.src(srcDir + 'vendors/**')
      .pipe(gulp.dest(buildDir + 'vendors/'))
      .pipe(reload({stream: true})); 
});





/**
 * Clean build folder
 *
 * @with  gulp-rimraf
 */

gulp.task('clean', function () {
   return gulp.src(buildDir, {
           read: false
       })
       .pipe(clean());
});







/**
 * Dev mode
 *
 */

gulp.task('dev', ['clean'], function(){

  gulp.start('browser_sync', 'fonts', 'sass', 'img', 'js', 'html', 'vendors');

  watch(srcDir + imgDir + '**', function(){
    gulp.start('img');
  });
  watch(srcDir + jsDir + '**', function(){
    gulp.start('js');
  });
  watch(srcDir + sassDir + '**/*.scss', function(){
    gulp.start('sass');
  });
  watch(srcDir + '*.html', function(){
    gulp.start('html');
  });
  watch(srcDir + 'vendors/**', function(){
    gulp.start('vendors');
  });

});




/* ------------------------------------- */





/**
 * Fonts
 *
 * @with otf2ttf gulp-ttf2woff gulp-base64 gulp-minify-css 
 * @return fonts in base64 encode
 */

gulp.task('fonts', function () {

   // otf to ttf
   gulp.src(srcDir + 'fonts/**/*.otf')
      .pipe(otf2ttf())
      .pipe(gulp.dest(srcDir + 'fonts/')); 

   // ttf to woff
   gulp.src(srcDir + 'fonts/**/*.ttf')
      .pipe(ttf2woff())
      .pipe(gulp.dest(srcDir + 'fonts/'));    
   
   // base64 fonts
   gulp.src([srcDir + fontsDir + 'ttf.css', srcDir + fontsDir + 'woff.css'])
      .pipe(base64({
          extensions: ['woff', 'ttf'],
          maxImageSize: 120000 * 1024
      }))
      .pipe(minifyCSS({
          keepSpecialComments: 0
      }))
      .pipe(gulp.dest(buildDir + 'css/'));

});




/* ------------------------------------- */






/**
 * Clean dist folder
 *
 * @with  gulp-rimraf
 */

gulp.task('clean-dist', function () {
   return gulp.src(distDir, {
           read: false
       })
       .pipe(clean());
});






/**
 * Generate dist folder
 *
 * @with  gulp-useref gulp-if gulp-base64 
 */

var assets = useref.assets();

gulp.task('dist', ['clean-dist'], function(){
   
   gulp.src(buildDir + imgDir + '**')
      .pipe(gulp.dest(distDir + imgDir));
     
   gulp.src(buildDir + '*.html')
       .pipe(assets)
       .pipe(gulpif('*.css', minifyCSS({keepSpecialComments: 0})))
       .pipe(assets.restore())
       .pipe(useref())
       .pipe(gulp.dest(distDir));

   gulp.src([buildDir + cssDir + 'ttf.css', buildDir + cssDir + 'woff.css'])
       .pipe(gulp.dest(distDir + cssDir));

   gulp.src([buildDir + cssDir + '*', '!'+ buildDir + cssDir + 'ttf.css', '!'+ buildDir + cssDir + 'woff.css'])
       .pipe(base64({
            extensions: ['svg', 'png', 'jpg'],
            maxImageSize: 100*1024, // bytes 
        }))
       .pipe(minifyCSS(minifyCSS({keepSpecialComments: 0})))
       .pipe(gulp.dest(distDir + cssDir));

    gulp.src([buildDir + jsDir + '*', '!' + buildDir + jsDir + '*.es6.js'])
       .pipe(uglify())
       .on('error', function (err) {
           console.log(err.message);
       })
       .pipe(gulp.dest(distDir + jsDir));

});






/**
 * Zip prod folder
 *
 * @with  gulp-zip
 */

gulp.task('zip', ['dist'], function () {
   gulp.src(distDir + '*')
       .pipe(zip('dist.zip'))
       .pipe(gulp.dest('./'));
});




/* **********************************

      _____       _       
     / ____|     | |      
    | |  __ _   _| |_ __  
    | | |_ |  | | | |  _ \ 
    | |__| | |_| | | |_) |
     \_____|\__,_|_|  __/  .
                   | |    
                   |_|    
                   
********************************** */
