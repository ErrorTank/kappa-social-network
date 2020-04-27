const socketNamespaces = [
    {
        key: "messenger",
        path: "/messenger",
        handlers: "./handlers/messenger.js",
        authenticated: true
    },
];

module.exports = {socketNamespaces};