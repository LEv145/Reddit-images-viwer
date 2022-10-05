const bemtree = require("enb-bemxjst/techs/bemtree")
const borschik_includer = require("borschik-includer")


module.exports = (
    bemtree.buildFlow()
    .name("borschik-bemtree")

    .defineOption("borschikMinimize", true)
    .defineOption("borschikFreeze", true)
    .defineOption("borschikComments", true)
    .defineOption("borschikTech", null)
    .defineOption("borschikTechOptions", null)

    .methods({_processSources: borschik_includer.processSources})

    .createTech()
)
