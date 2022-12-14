// @ts-ignore
block("page-index").content()((node, ctx) => {
    return node.data.posts.map(
        item => ({
            mix: [{block: "page-index", elem: "card-post"}],
            block: "card-post",
            data: {
                url: item.url,
                title: item.title,
                subtitle: item.subtitle,
                tag: item.tag,
            }
        })
    )
});
