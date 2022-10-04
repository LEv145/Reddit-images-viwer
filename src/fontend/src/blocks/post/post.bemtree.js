/**
 * @param {String} url
 * @param {String} title
 * @param {String} subtitle
 * @param {String} tag_
 */

// @ts-ignore
block("post").content()((node, ctx) => {
    const data = ctx.data

    const result = [
        {elem: "subtitle", content: data.subtitle},
        {elem: "title", content: [{elem: "title-text", content: data.title}]},
        {
            mix: [{block: "post", elem: "image"}],
            block: "image",
            url: data.url,
            width: 512,
            height: 512,
        },
    ]

    if (data.tag !== undefined) {
        result[1].content.unshift({
            mix: [{block: "post", elem: "title-tag"}],
            block: "tag",
            content: data.tag,
        })
    }

    return result
});
