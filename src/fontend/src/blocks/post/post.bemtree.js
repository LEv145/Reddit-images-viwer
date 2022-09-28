/**
 * @param {String} url
 * @param {String} title
 * @param {String} subtitle
 * @param {String} tag_
 */

// @ts-ignore
block("post").content()((node, ctx) => (
    [
        {elem: "subtitle", content: ctx.subtitle},
        {
            elem: "title",
            content: [
                {
                    mix: [{block: "post", elem: "title-tag"}],
                    block: "tag",
                    content: ctx.tag_,
                },
                {elem: "title-text", content: ctx.title},
            ]
        },
        {
            mix: [{block: "post", elem: "image"}],
            block: "image",
            url: ctx.url,
            width: 512,
            height: 512,
        },
    ]
));
