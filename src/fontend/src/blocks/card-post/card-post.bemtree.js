/**
 * @param {String} url
 * @param {String} title
 * @param {String} subtitle
 * @param {String} tag_
 */

// @ts-ignore
block("card-post").content()((node, ctx) => (
    {
        block: "post",
        url: ctx.url,
        title: ctx.title,
        subtitle: ctx.subtitle,
        tag_: ctx.tag_,
    }
));
