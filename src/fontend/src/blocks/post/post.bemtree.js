block("post").content()((node, ctx) => (
    [
        {elem: "subtitle"},
        {
            elem: "title",
            content: [
                {elem: "title-tag", block: "tag"},
                {elem: "title-text"},
            ]
        },
        {elem: "image", block: "image"},
    ]
));
