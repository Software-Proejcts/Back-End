const { src, dest } = require('gulp');

function buildServer(cb) {
    return src('src/server/*.js')
        .pipe(dest('build/server/'));
}

exports.default = buildServer