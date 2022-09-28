const bemtree = require("enb-bemxjst/techs/bemtree")
const bemxjst_utils = require("./utils/bemxjst")


module.exports = (
    bemtree.buildFlow()
    .name("borschik-bemtree")

    .defineOption("borschikMinimize", true)
    .defineOption("borschikFreeze", true)
    .defineOption("borschikComments", true)
    .defineOption("borschikTech", null)
    .defineOption("borschikTechOptions", null)

    .methods({_processSources: bemxjst_utils._processSources})

    .createTech()
)
