import path from "path"

// ######### Express.js #########
import express from "express"
// Middlewares
import faviconMiddleware from "serve-favicon"  // Favicon
import morganMiddleware from "morgan"  // HTTP request logger
import serveStaticMiddleware from "serve-static"  // Static
import cookieParserMiddleware from "cookie-parser"  // Cookies
import expressSessionMiddleware from "express-session"  // Sessions
import slashesMiddleware from "connect-slashes"  // Trailing slash redirect middleware for Connect and Express.js
import passport from "passport"  // Simple, unobtrusive authenticatio
import csrfMiddleware from "csurf"  // CSRF
import compressionMiddleware from "compression"  // Compression response
// Debug
import debugHttp from "debug-http"
// Etc.
import errorHandler from "errorhandler"
// ######### Express.js #########
import {open} from "sqlite"
import sqlite3 from "sqlite3"

import {ConfigFactory} from "./config.mjs"
import {BemRender} from "./bem-render.mjs"


async function main() {
    const config = new ConfigFactory().get()
    const app = express()
    const db = await open({
        filename: path.join(process.cwd(), config.databasePath),
        driver: sqlite3.Database,
    })

    const _frontendPath = path.resolve(process.cwd(), config.fontendPath)
    const _frontendBuildPath = path.join(_frontendPath, "dist")
    const frontendStaticPath = path.join(_frontendBuildPath, "static")
    const frontendBundlesPath = path.join(_frontendBuildPath, "bundles")

    const bemRender = new BemRender({path: frontendBundlesPath, isDev: config.isDev})


    const posts = await db.all("SELECT * FROM Posts")
    await db.close()


    debugHttp()


    passport.serializeUser((user, done) => done(null, JSON.stringify(user)))
    passport.deserializeUser((user, done) => done(null, JSON.parse(user)))


    app
        .disable("x-powered-by")
        .enable("trust proxy")
        .use(compressionMiddleware())
        .use(faviconMiddleware(path.join(frontendStaticPath, "favicon.ico")))
        .use(serveStaticMiddleware(frontendStaticPath))
        .use(morganMiddleware("combined"))
        .use(cookieParserMiddleware())
        .use(expressSessionMiddleware({
            resave: true,
            saveUninitialized: true,
            secret: config.sessionSecret
        }))
        .use(passport.initialize())
        .use(passport.session())
        .use(csrfMiddleware())

    if (config.isDev){
        app
            .use(slashesMiddleware())  // NOTE: conflicts with browser livereload
            .use(errorHandler())
    }


    app.get(
        "/",
        /**
         * @param {express.Request} requets
         * @param {express.Response} response
         */
        async function(requets, response){
            bemRender.read(requets, response, {
                bundleName: "index",
                data: {
                    view: "page-index",
                    title: "Main page",
                    meta: {
                        description: "Page description",
                        og: {url: "https://site.com", siteName: "Site name"},
                    },
                    posts: posts,
                },
            })
        },
    )
    app.get(
        "/ping/",
        /**
         * @param {express.Request} requets
         * @param {express.Response} response
         */
        function(requets, response) {
            response.send("ok")
        },
    )
    app.get(
        "*",
        /**
         * @param {express.Request} requets
         * @param {express.Response} response
         */
        async function(requets, response) {
            response.status(404)
            bemRender.read(requets, response, {
                bundleName: "index",
                data: {view: "404"},
            })
        },
    )
    app.listen(
        config.port,
        function() {
            console.log(`Listening on port: ${this.address().port}`)
            console.log(`Dev mode: ${config.isDev}`)
        }
    )
}


main()
