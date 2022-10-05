import path from "path"

import {open, Database} from "sqlite"
import sqlite3 from "sqlite3"

import {RedditService} from "./api.mjs"
import {ConfigFactory} from "./config.mjs"


async function main() {
    const config = new ConfigFactory().get()
    const args = _getArgs()
    const db = await open({
        filename: path.join(process.cwd(), config.databasePath),
        driver: sqlite3.Database
    })
    const service = new RedditService({
        userAgent: config.userAgent,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password,
    })

    const posts = await service.getPosts({subredditName: args.subredditName, count: args.count})

    _writeToDatabase(args.subredditName, db, posts)

    await db.close()
}


function _getArgs() {
    return {
        subredditName: process.argv[2],
        count: parseInt(process.argv[3]),
    }
}

/**
 *
 * @param {string} subredditName
 * @param {Database} db
 * @param {{url: string; title: string; authorName: string; tag: string;}[]} posts
 */
async function _writeToDatabase(subredditName, db, posts) {
    await Promise.all(
        posts.map(async (post) => {
            await db.run(
                "INSERT INTO Posts VALUES (?, ?, ?, ?, ?)",
                [
                    subredditName,
                    post.url,
                    post.title,
                    post.authorName,
                    post.tag,
                ],
            )
        })
    )
}


main()
