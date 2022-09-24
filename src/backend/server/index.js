const path = require("path")

// Express.js
const express = require("express")
// Middlewares
const faviconMiddleware = require("serve-favicon")  // Favicon
const morganMiddleware = require("morgan")  // HTTP request logger
const serveStaticMiddleware = require("serve-static")  // Static
const cookieParserMiddleware = require("cookie-parser")  // Cookies
const expressSessionMiddleware = require("express-session")  // Sessions
const slashesMiddleware = require("connect-slashes")  // Trailing slash redirect middleware for Connect and Express.js
const passportMiddleware = require("passport")  // Simple, unobtrusive authenticatio
const csrfMiddleware = require("csurf")  // CSRF
const compressionMiddleware = require("compression")  // Compression response
// Debug
const debugHttp = require("debug-http")
// Etc.
const errorHandler = require("errorhandler")

const config = require("./config")
const bemRender_ = require("./bem-render")


const _FRONTEND_PATH = path.resolve(__dirname, "..", "..", config.fontendPath)
const _FRONTEND_BUILD_PATH = path.join(_FRONTEND_PATH, "build")
const FRONTEND_STATIC_PATH = path.join(_FRONTEND_BUILD_PATH, "static")
const FRONTEND_BUNDLES_PATH = path.join(_FRONTEND_BUILD_PATH, "bundles")

const IS_DEV = process.env.NODE_ENV === "dev"
const PORT = process.env.PORT || config.defaultPort

const bemRender = new bemRender_.BemRender({
    path: FRONTEND_BUNDLES_PATH,
    isDev: IS_DEV,
})
const app = express()


debugHttp()

passportMiddleware.serializeUser((user, done) => done(null, JSON.stringify(user)))
passportMiddleware.deserializeUser((user, done) => done(null, JSON.parse(user)))


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
    .use(passportMiddleware.initialize())
    .use(passportMiddleware.session())
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
    function(requets, response)
    {
        bemRender.read(requets, response, {
            bundleName: "index",
            data: {
                view: "page-index",
                title: "Main page",
                meta: {
                    description: "Page description",
                    og: {url: "https://site.com", siteName: "Site name"},
                },
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
    function(requets, response) {
        response.status(404)
        return bemRender.read(requets, response, {
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
