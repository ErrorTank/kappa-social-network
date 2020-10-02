const socketNamespaces = [
  {
    key: "messenger",
    path: "/messenger",
    handlers: "./handlers/messenger.js",
    authenticated: true,
  },
  {
    key: "feedPost",
    path: "/feed-post",
    handlers: "./handlers/feed-post.js",
    authenticated: true,
  },
];

module.exports = { socketNamespaces };
