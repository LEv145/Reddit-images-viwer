const borschik_includer = require("borschik-includer")


async function _processSources(sources) {
    const borschikIncluder = new borschik_includer.BorschikIncluder({
        minimize: this._borschikMinimize,
        freeze: this._borschikFreeze,
        comments: this._borschikComments,
        tech: this._borschikTech,
        techOptions: this._borschikTechOptions,
    })
    return await borschikIncluder.use(sources)
}


module.exports = {
    _processSources: _processSources,
}
