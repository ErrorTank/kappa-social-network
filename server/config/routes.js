const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO) => {
    router.use("/api", require("../controllers/guest-controller")(db));
    router.use("/api/user", require("../controllers/user-controller")(db));
    router.use("/api/utility", require("../controllers/utility-controller")(db));
    router.use("/api/chat", require("../controllers/chat-controller")(db, namespacesIO));
    router.use("/api/messenger", require("../controllers/messenger-controller")(db, namespacesIO));
    return router;
};