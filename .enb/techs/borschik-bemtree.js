const fs = require("fs")

const tmp = require("tmp")
const bem_xjst = require("enb-bemxjst/techs/bem-xjst")
const borschik_api = require("borschik").api


module.exports = bem_xjst.buildFlow()
    .name("bemtree")
    .target("target", "?.bemtree.js")

    .defineOption("exportName", "BEMTREE")
    .defineOption("engineOptions")
    .defineOption("requires")
    .defineOption("forceBaseTemplates", false)
    // БорщЪ
    // .defineOption("borschikMinify", true)
    // .defineOption("borschikFreeze", true)
    // .defineOption("borschikComments", true)
    // .defineOption("borschikTech", null)
    // .defineOption("borschikTechOptions", null)

    .useFileList(["bemtree.js"])
    .builder(function (fileList) {
        // don"t add fat wrapper code of bem-xjst
        if (!this._forceBaseTemplates && fileList.length === 0) return this._mockBEMTREE()

        let filenames = this._getUniqueFilenames(fileList)

        return (
            this._readFiles(filenames)
            .then(this._processSources, this)
            .then(this._useBorschik, this)
            .then(this._compileBEMTREE, this)
        )
    })
    .methods({
        /**
         * Returns BEMTREE mock.
         *
         * @returns {String}
         * @private
         */
        _mockBEMTREE: () => {
            const bundle = require("enb-bemxjst/lib/bundle")
            let code = "exports.apply = function (data) { return data; };"

            return bundle.compile(code, {exportName: this._exportName})
        },
        /**
         * Compiles source code using BEMTREE processor.
         * Wraps compiled code for usage with different modular systems.
         *
         * @param {{ path: String, contents: String }[]} sources — objects that contain file information.
         * @returns {Promise}
         * @private
         */
        _useBorschik: async function(sources) {
            for (i in sources) {
                const source = sources[i]

                const tmpObject = tmp.fileSync()

                await borschik_api({
                    input: source.path,
                    output: tmpObject.name,
                    freeze: true,
                    tech: null,
                    techOptions: null,
                    comments: true,
                    minimize: false,
                })

                contents = fs.readFileSync(tmpObject.name, "utf-8")
                sources[i].contents = contents

                tmpObject.removeCallback()
            }
            return sources
        },
        /**
         * Compiles source code using BEMTREE processor.
         * Wraps compiled code for usage with different modular systems.
         *
         * @param {{ path: String, contents: String }[]} sources — objects that contain file information.
         * @returns {Promise}
         * @private
         */
        _compileBEMTREE: function (sources) {
            let compilerFilename = require.resolve("enb-bemxjst/lib/bemtree-processor")

            return this._compileBEMXJST(sources, compilerFilename)
        }
    })
    .createTech();
