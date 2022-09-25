const bemhtml = require("enb-bemxjst/techs/bemhtml")
const borschik_includer = require("borschik-includer")


module.exports = (
    bemhtml.buildFlow()
    .name("borschik-bemhtml")

    .defineOption("borschikMinimize", true)
    .defineOption("borschikFreeze", true)
    .defineOption("borschikComments", true)
    .defineOption("borschikTech", null)
    .defineOption("borschikTechOptions", null)

    .methods({
        _processSources: async function(sources) {
            const borschikIncluder = new borschik_includer.BorschikIncluder({
                minimize: this._borschikMinimize,
                freeze: this._borschikFreeze,
                comments: this._borschikComments,
                tech: this._borschikTech,
                techOptions: this._borschikTechOptions,
            })
            return await borschikIncluder.use(sources)
        }
    })
    
    .createTech()
)
