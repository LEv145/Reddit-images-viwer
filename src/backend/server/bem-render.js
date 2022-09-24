const path = require("path")
const decache = require("decache")
const express = require("express")


/**
 *
 * @param {string} filename
 * @returns
 */
function _evalFile(filename) {
    decache(filename)
    // Fixes memory leak
    // clean module from links to previous parsed files
    module.children = module.children.filter(item => item.id !== filename)
    return require(filename)
}


class BemRender {
    /**
     * @param {object} _data
     * @param {boolean} _data.isDev
     * @param {string} _data.path
     * @returns
     */
    constructor(_data) {
        this._path = _data.path
        this._isDev = _data.isDev
    }

    /**
     * @param {express.Request} request
     * @param {express.response} response
     * @param {object} _data
     * @param {string} _data.bundleName
     * @param {object} _data.data
     * @param {object} _data.ctx
     */
    read(request, response, _data) {
        const bundleName = _data.bundleName
        const data = _data.data
        const ctx = _data.ctx

        const query = request.query
        const templates = this._getTemplates(bundleName)

        if (this.isDev && query.json) {
            return response.send(`<pre>${JSON.stringify(data, null, 4)}</pre>`)
        }

        const bemtreeCtx = {
            block: "root",
            context: ctx,
            // extend with data needed for all routes
            data: Object.assign(
                {},
                {url: request._parsedUrl, csrf: request.csrfToken()},
                data,
            )
        }

        let bemjson
        try {
            bemjson = templates.BEMTREE.apply(bemtreeCtx)
        } catch(error) {
            console.error("BEMTREE error", error.stack)
            console.trace("server stack")
            return response.sendStatus(500)
        }

        if (this.isDev && query.bemjson) {
            return response.send(`<pre>${JSON.stringify(bemjson, null, 4)}</pre>`)
        }

        let html
        try {
            html = templates.BEMHTML.apply(bemjson)
        } catch(error) {
            console.error("BEMHTML error", error.stack)
            return response.sendStatus(500)
        }
        response.send(html)
    }

    /**
     *
     * @param {string} bundleName
     * @returns
     */
    _getTemplates(bundleName) {
        return {
            BEMTREE: _evalFile(path.join(this._path, `${bundleName}.bemtree.js`)).BEMTREE,
            BEMHTML: _evalFile(path.join(this._path, `${bundleName}.bemhtml.js`)).BEMHTML,
        }
    }
}


module.exports = {
    BemRender: BemRender,
}
