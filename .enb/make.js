const path = require("path")


const techs = {
    fileProvider: require("enb/techs/file-provider"),
    fileMerge: require("enb/techs/file-merge"),
    fileCopy: require("enb/techs/file-copy"),
    borschik: require("enb-borschik/techs/borschik"),
    postcss: require("enb-postcss/techs/enb-postcss"),
    postcssPlugins: [
        require("postcss-import")(),
        // require("postcss-each"),
        // require("postcss-for"),
        // require("postcss-simple-vars")(),
        // require("postcss-calc")(),
        require("postcss-nested"),
        require("rebem-css"),
        require("postcss-url")({url: "inline"}),
        require("autoprefixer")(),
    ],
    browserJs: require("enb-js/techs/browser-js"),
    borschikBemtree: require("./techs/borschik-bemtree"),
    borschikBemhtml: require("./techs/borschik-bemhtml"),
}
const enbBemTechs = require("enb-bem-techs")


const LEVELS = [
    {path: "node_modules/bem-core/common.blocks", check: false},
    {path: "node_modules/bem-core/desktop.blocks", check: false},
    {path: "node_modules/bem-components/common.blocks", check: false},
    {path: "node_modules/bem-components/desktop.blocks", check: false},
    {path: "node_modules/bem-components/design/common.blocks", check: false},
    {path: "node_modules/bem-components/design/desktop.blocks", check: false},
    "src/fontend/src/blocks",
]
const IS_PROD = process.env.YENV === "prod"
const ROOT_PATH = "../../../"
const BUILD_PATH = path.join(ROOT_PATH, "build")
const STATIC_PATH = path.join(BUILD_PATH, "static")
const BUNDLES_PATH = path.join(BUILD_PATH, "bundles")


module.exports = function(config) {
    config.nodes(
        "src/fontend/src/bundles/*",
        function(nodeConfig) {
            nodeConfig.addTechs([
                // essential
                [enbBemTechs.levels, {levels: LEVELS}],
                [techs.fileProvider, {target: "?.bemdecl.js"}],
                [enbBemTechs.deps],
                [enbBemTechs.files],


                // css
                [techs.postcss, {
                    target: "?.css",
                    oneOfSourceSuffixes: ["post.css", "css"],
                    plugins: techs.postcssPlugins,
                }],


                // bemtree
                [techs.borschikBemtree, {
                    sourceSuffixes: ["bemtree.js"],
                }],
                // [techs.borschik, {
                //     source: "?.bemtree.js",
                //     target: "?.borschik.bemtree.js",
                //     freeze: true,
                //     minify: IS_PROD,
                // }],

                // templates
                [techs.borschikBemhtml, {
                    sourceSuffixes: ["bemhtml.js"],
                    forceBaseTemplates: true,
                    engineOptions: {elemJsInstances: true},
                }],

                // client bemhtml
                [enbBemTechs.depsByTechToBemdecl, {
                    target: "?.bemhtml.bemdecl.js",
                    sourceTech: "js",
                    destTech: "bemhtml",
                }],
                [enbBemTechs.deps, {
                    target: "?.bemhtml.deps.js",
                    bemdeclFile: "?.bemhtml.bemdecl.js",
                }],
                [enbBemTechs.files, {
                    depsFile: "?.bemhtml.deps.js",
                    filesTarget: "?.bemhtml.files",
                    dirsTarget: "?.bemhtml.dirs",
                }],
                [techs.borschikBemhtml, {
                    target: "?.browser.bemhtml.js",
                    filesTarget: "?.bemhtml.files",
                    sourceSuffixes: ["bemhtml", "bemhtml.js"],
                    engineOptions: {elemJsInstances: true},
                }],

                // js
                [techs.browserJs, {includeYM: true}],
                [techs.fileMerge, {
                    target: "?.js",
                    sources: ["?.browser.js", "?.browser.bemhtml.js"],
                }],

                // borschik
                [techs.borschik, {source: "?.js", target: "?.min.js", minify: IS_PROD}],
                [techs.borschik, {source: "?.css", target: "?.min.css", minify: IS_PROD}],

                [techs.fileCopy, {source: "?.min.js", target: `${STATIC_PATH}/?.min.js`}],
                [techs.fileCopy, {source: "?.min.css", target: `${STATIC_PATH}/?.min.css`}],
                [techs.fileCopy, {source: "?.bemhtml.js", target: `${BUNDLES_PATH}/?.bemhtml.js`}],
                [techs.fileCopy, {source: "?.bemtree.js", target: `${BUNDLES_PATH}/?.bemtree.js`}],
            ])
            nodeConfig.addTargets([
                `${BUNDLES_PATH}/?.bemtree.js`,
                `${BUNDLES_PATH}/?.bemhtml.js`,
                `${STATIC_PATH}/?.min.js`,
                `${STATIC_PATH}/?.min.css`,
            ])
        },
    )
}
