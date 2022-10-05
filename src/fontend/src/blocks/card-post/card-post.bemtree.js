/**
 * @param {String} url
 * @param {String} title
 * @param {String} subtitle
 * @param {String} tag_
 */

// @ts-ignore
block("card-post").content()((node, ctx) => (
    {block: "post", data: ctx.data}
));
