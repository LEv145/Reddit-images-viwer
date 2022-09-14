const enb = require("enb");
const gulp = require("gulp");
const BrowserSync = require("browser-sync");


const SOURCE_PATH = "src";
const browser_sync = BrowserSync.create();


function build_pages() {
    return enb.make();
};

// function build_assets() {
//     return (
//         gulp
//         .src(`${SOURCE_PATHS.assets}/**/*`)
//         .pipe(gulp.dest(`${BUILD_PATH}/assets`))
//     );
// }

// function build_static() {
//     return (
//         gulp
//         .src(`${SOURCE_PATHS.static}/**/*`)
//         .pipe(gulp.dest(`${BUILD_PATH}/static`))
//     );
// }

let build = gulp.parallel(build_pages);

// function dev() {
//     browser_sync.init({server: {baseDir: BUILD_PATH}, open: false});
//     // Static
//     gulp.watch(
//         `${SOURCE_PATH}/**/*`,
//         gulp.parallel(_reloadbrowser_sync, build),
//     );
// }

function _reloadbrowser_sync(next) {
    browser_sync.reload();
    next();
}


// exports.build_static = build_static;
// exports.build_assets = build_assets;
// exports.build_pages = build_pages;
exports.build = build;
// exports.dev = dev;
