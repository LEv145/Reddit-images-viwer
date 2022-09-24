const bemhtml = require("enb-bemxjst/techs/bemhtml")
const borschik_includer = require("../modules/borschik-includer")


module.exports = (
    bemhtml.buildFlow()
    .name("borschik-bemhtml")

    .defineOption("borschikMinimize", true)
    .defineOption("borschikFreeze", true)
    .defineOption("borschikComments", true)
    .defineOption("borschikTech", null)
    .defineOption("borschikTechOptions", null)

    .builder(function (fileList) {
        // don't add fat wrapper code of bem-xjst
        if (!this._forceBaseTemplates && fileList.length === 0) return this._mockBEMHTML()

        const borschikIncluder = new borschik_includer.BorschikIncluder({
            minimize: this._borschikMinimize,
            freeze: this._borschikFreeze,
            comments: this._borschikComments,
            tech: this._borschikTech,
            techOptions: this._borschikTechOptions,
        })
        const filenames = this._getUniqueFilenames(fileList)

        return (
            this._readFiles(filenames)
            .then(this._processSources, this)
            .then(borschikIncluder.use, this)
            .then(this._compileBEMHTML, this)
        )
    })
    .createTech()
)
