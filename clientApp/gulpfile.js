var gulp = require('gulp');
const runSequence = require('run-sequence');
const replace = require('gulp-string-replace');
const conf = require('./node_modules/@ericsson/cus-ui/boilerplate/gulp/config');
const Builder = require('systemjs-builder');

var requireDir = require('require-dir');
requireDir('./node_modules/@ericsson/cus-ui/boilerplate/gulp/tasks');

gulp.task('prefix_routes', prefixRoutes);
gulp.task('bundle', bundle);
gulp.task('push_tpg_dep', pushTpgNameIntoSystemConfig);
gulp.task('bundle-libs', bundlelibs);


/* bundle libs */
function bundlelibs() {
    const builder = new Builder(conf.path.tmp('compiled'), conf.path.tmp('compiled/prod-config/system-config.js'));
    builder.bundle('demotpg/**/* - [demotpg/**/*]', conf.path.tmp('compiled/lib.bundle.js'));
}

/* build libs for production */
gulp.task('build:prod', function(done) {
    runSequence('clean', 'compile', 'systemjs_config', 'push_tpg_dep', 'prefix_routes', 'bundle-libs', done);
});

/* This task is used to replace routes in routing file to support cus */
function prefixRoutes() {
    gulp.src([conf.path.tmp('compiled/demotpg/demotpg.subroutes.routing.js')])
        .pipe(replace('loadChildren: \'./', 'loadChildren: \'./demotpg/'))
        .pipe(gulp.dest(conf.path.tmp('compiled/demotpg')))
}

/* bundle lazy loaded mytpg chunks */
function bundle() {
    const builder = new Builder(conf.path.tmp('compiled'), conf.path.tmp('compiled/prod-config/system-config.js'));
    builder.bundle('demotpg/* - lib.bundle.js', conf.path.tmp('build/demotpg/demotpg.js'));
    // Lazy loaded modules
    /*builder.bundle('demotpg/sampleone/* - lib.bundle.js', conf.path.tmp('build/demotpg/sampleone-chunk.js'));
    builder.bundle('demotpg/sampletwo/* - lib.bundle.js', conf.path.tmp('build/demotpg/sampletwo-chunk.js'));
    builder.bundle('demotpg/samplethree/* - lib.bundle.js', conf.path.tmp('build/demotpg/samplethree-chunk.js'));*/
    gulp.src([conf.path.src("demotpg/system-config.js")]).pipe(gulp.dest(conf.path.dist('demotpg')));
}

/* create new system config for compiling with node_modules reference */
function pushTpgNameIntoSystemConfig(done) {
    var replacedPathAlias = getPathAlias();
    gulp.src([conf.path.tmp('compiled/prod-config/system-config.js')])
        .pipe(replace(/new_packages = {/, replacedPathAlias))
        .pipe(gulp.dest(conf.path.tmp('compiled/prod-config')))
        .on('end', function() { done(); });
}

/* get path alias for system config for node_modules reference*/
function getPathAlias() {
    return 'new_packages = {\'demotpg\': { defaultExtension: \'js\' },';
}