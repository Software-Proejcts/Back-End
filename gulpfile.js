const gulp = require('gulp');

function buildClient(cb) {
    return gulp.src('src/www/**')
        .pipe(gulp.dest('build/server/www/'));
}

function buildServer(cb) {
    return gulp.src('src/server/*.js')
        .pipe(gulp.dest('build/server/'));
}

exports.default = gulp.parallel(buildServer, buildClient);