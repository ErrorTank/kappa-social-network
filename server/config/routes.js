const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO) => {
    router.use("/api", require("../controllers/guest-controller")(db));
    router.use("/api", require("../controllers/user-controller")(db));
    return router;
};