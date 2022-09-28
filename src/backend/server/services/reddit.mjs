import snoowrap from "snoowrap"


export class RedditService {

    /**
     *
     * @param {{
     *      userAgent: string,
     *      clientId: string,
     *      clientSecret: string,
     *      username: string,
     *      password: string,
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
     *      subredditName: string,
     * }} param0
     * @returns {Promise<{url: string, title: string, subtitle: string, tag_: string}>}
     */
    async _getRandomPost({subredditName}){
        /**
         * @type {snoowrap.Submission}
         */
        // @ts-ignore
        let submission = await this._client.getRandomSubmission(subredditName)

        return {
            url: submission.url,
            title: submission.title,
            subtitle: submission.author_fullname,
            tag_: submission.id,
        }
    }

    /**
     *
     * @param {{
     *      subredditName: string,
     *      count: number,
     * }} param0
     * @returns {Promise<{url: string, title: string, subtitle: string, tag_: string}[]>}
     */
    async getPosts({subredditName, count}) {
        return await Promise.all(
            [...Array(count).map((_) => this._getRandomPost({subredditName: subredditName}))]
        )
    }
}
