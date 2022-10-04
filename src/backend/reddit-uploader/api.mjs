import snoowrap from "snoowrap"
import {range, chain, chunked} from "itertools"
import {sleepSeconds} from "sleepjs"


export class RedditService {

    /**
     *
     * @param {{
     *      userAgent: string
     *      clientId: string
     *      clientSecret: string
     *      username: string
     *      password: string
     * }} param0
     */
    constructor({
        userAgent,
        clientId,
        clientSecret,
        username,
        password,
    }) {
        this._client = new snoowrap({
            userAgent: userAgent,
            clientId: clientId,
            clientSecret: clientSecret,
            username: username,
            password: password,
        })
    }

    /**
     *
     * @param {{
     *      subredditName: string
     * }} param0
     * @returns {Promise<{url: string, title: string, authorName: string, tag: string}>}
     */
    async _getRandomPost({subredditName}){
        let submission

        while (true){
            /**
             * @type {snoowrap.Submission}
             */
            // @ts-ignore
            submission = await this._client.getRandomSubmission(subredditName)

            if (submission.post_hint == "image") break
        }

        return {
            url: submission.url,
            title: submission.title,
            authorName: submission.author_fullname,
            tag: submission.id,
        }
    }

    /**
     *
     * @param {{
     *      subredditName: string
     *      count: number
     *      sleepSecondsCount?: number
     *      chunkedCount?: number
     * }} param0
     * @returns {Promise<{url: string, title: string, authorName: string, tag: string}[]>}
     */
    async getPosts({subredditName, count, sleepSecondsCount=61, chunkedCount=30}) {
        const tasks = []
        for (const i of range(count)) {
            tasks.push(this._getRandomPost)
        }

        const partitionTasks = chunked(tasks, chunkedCount)

        const completedTasks = []
        for (const i of partitionTasks) {
            const result = await Promise.all(i.map(x => x.call(this, {subredditName: subredditName})))
            completedTasks.push(result)

            if (completedTasks.length > 1) await sleepSeconds(sleepSecondsCount)
        }

        return [...chain(...completedTasks)]
    }
}
