export class ConfigFactory {
    /**
     *
     * @param {{
     *      prefix?: string
     * }} param0
     */
    constructor({prefix="REDDIS_UPLOADER__"} = {}) {
        this._prefix = prefix
    }

    get() {
        return {
            userAgent: process.env[`${this._prefix}USER_AGENT`],
            clientId: process.env[`${this._prefix}CLIENT_ID`],
            clientSecret: process.env[`${this._prefix}CLIENT_SECRET`],
            username: process.env[`${this._prefix}USERNAME`],
            password: process.env[`${this._prefix}PASSWORD`],
            databasePath: process.env[`${this._prefix}DATABASE_PATH`] ?? "database.sql",
        }
    }
}
