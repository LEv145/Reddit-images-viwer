block("logo").content()((node, ctx) => (
    [
        {
            mix: {block: "logo", elem: "image"},
            block: "image",
            alt: "Logo",
            url: borschik.link("imgs/logo.png"),
            width: 32,
            height: 32,
        },
        {
            elem: "text",
            content: "RIV"
        },
    ]
));
