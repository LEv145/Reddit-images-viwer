const bemhtml = require("enb-bemxjst/techs/bemhtml")
const bemxjst_utils = require("./utils/bemxjst")


module.exports = (
    bemhtml.buildFlow()
    .name("borschik-bemhtml")

    .defineOption("borschikMinimize", true)
    .defineOption("borschikFreeze", true)
    .defineOption("borschikComments", true)
    .defineOption("borschikTech", null)
    .defineOption("borschikTechOptions", null)

    .methods({_processSources: bemxjst_utils._processSources})

    .createTech()
)
