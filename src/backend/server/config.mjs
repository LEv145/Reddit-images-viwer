export class ConfigFactory {
    /**
     *
     * @param {{
     *      prefix?: string
     * }} param0
     */
    constructor({prefix="NODE_SERVER__"} = {}) {
        this._prefix = prefix
    }

    get() {
        return {
            sessionSecret: process.env[`${this._prefix}SESSION_SECRET`],
            port: process.env[`${this._prefix}PORT`] ?? 8080,
            fontendPath: process.env[`${this._prefix}FONTEND_PATH`] ?? "fontend",
            isDev: Boolean(process.env[`${this._prefix}IS_DEV`]) ?? false,
            databasePath: process.env[`${this._prefix}DATABASE_PATH`] ?? "database.sql",
        }
    }
}
