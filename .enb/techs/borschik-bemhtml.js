const borschik_includer = require("borschik-includer")


module.exports = (
    bemhtml.buildFlow()
    .name("borschik-bemhtml")

    .defineOption("borschikMinimize", true)
    .defineOption("borschikFreeze", true)
    .defineOption("borschikComments", true)
    .defineOption("borschikTech", null)
    .defineOption("borschikTechOptions", null)

    .methods({_processSources: borschik_includer.processSources})

    .createTech()
)
