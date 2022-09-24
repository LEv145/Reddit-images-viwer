const enb = require("enb")
const gulp = require("gulp")


const SOURCE_PATH = "src/fontend/src"


function build() {
    return enb.make()
}

function clean() {
    return enb.make(["clean"])
}

function server() {
    return enb.runServer({port: 3000})
}

watch = gulp.parallel(
    build,
    () => gulp.watch(
        [`${SOURCE_PATH}/blocks/**/*`, `${SOURCE_PATH}/bundles/*/*.bemdecl.js`],
        gulp.parallel(build),
    ),
)


// function _reloadbrowser_sync(next) {
//     browser_sync.reload()
//     next()
// }


exports.build = build
exports.clean = clean
exports.server = server
exports.watch = watch
exports.default = exports.watch
