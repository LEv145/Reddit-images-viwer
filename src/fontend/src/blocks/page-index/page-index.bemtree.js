// @ts-ignore
block("page-index").content()((node, ctx) => {
    return node.data.posts.map(
        item => ({
            mix: [{block: "page-index", elem: "card-post"}],
            block: "card-post",
            url: item.url,
            title: item.title,
            subtitle: item.subtitle,
            tag_: item.tag_,
        })
    )
});
