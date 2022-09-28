import path from "path"
import url from "url"

// Express.js
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

import config from "./config.mjs"
import {BemRender} from "./bem-render.mjs"
import {RedditService} from "./services/reddit.mjs"


const _DIRNAME = path.dirname(url.fileURLToPath(import.meta.url))
const _FRONTEND_PATH = path.resolve(_DIRNAME, "..", "..", config.fontendPath)
const _FRONTEND_BUILD_PATH = path.join(_FRONTEND_PATH, "dist")

const FRONTEND_STATIC_PATH = path.join(_FRONTEND_BUILD_PATH, "static")
const FRONTEND_BUNDLES_PATH = path.join(_FRONTEND_BUILD_PATH, "bundles")

const IS_DEV = process.env.NODE_ENV === "dev"
const PORT = process.env.PORT || config.defaultPort

const bemRender = new BemRender({
    path: FRONTEND_BUNDLES_PATH,
    isDev: IS_DEV,
})
const app = express()


debugHttp()

passport.serializeUser((user, done) => done(null, JSON.stringify(user)))
passport.deserializeUser((user, done) => done(null, JSON.parse(user)))


app
    .disable("x-powered-by")
    .enable("trust proxy")
    .use(compressionMiddleware())
    .use(faviconMiddleware(path.join(FRONTEND_STATIC_PATH, "favicon.ico")))
    .use(serveStaticMiddleware(FRONTEND_STATIC_PATH))
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


if (IS_DEV){
    app.use(slashesMiddleware())  // NOTE: conflicts with livereload
    app.use(errorHandler())
}

app.get(
    "/",
    /**
     * @param {express.Request} requets
     * @param {express.Response} response
     */
    async function(requets, response){
        // let redditService = new RedditService({
        //     userAgent: config.reddit.userAgent,
        //     clientId: config.reddit.clientId,
        //     clientSecret: config.reddit.clientSecret,
        //     username: config.reddit.username,
        //     password: config.reddit.password,
        // })
        // let posts = await redditService.getPosts({subredditName: "furry", count: 10})

        bemRender.read(requets, response, {
            bundleName: "index",
            data: {
                view: "page-index",
                title: "Main page",
                meta: {
                    description: "Page description",
                    og: {url: "https://site.com", siteName: "Site name"},
                },
                // posts: posts,
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
    PORT,
    function() {
        console.log(`Listening on port ${this.address().port}`)
        console.log(`Dev mode: ${IS_DEV}`)
    }
)
