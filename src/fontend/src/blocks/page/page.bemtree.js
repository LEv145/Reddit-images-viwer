block("page")({
    content: (node, ctx) => [
        {block: "header"},
        {block: "body"},
        {block: "footer"},
    ],
});
block("page").mod("view", "404")({
    "content": (node, ctx) => "404",
});
