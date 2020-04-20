const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO) => {
    router.use("/api", require("../controllers/guest-controller")(db));
    router.use("/api/user", require("../controllers/user-controller")(db));
    router.use("/api/utility", require("../controllers/utility-controller")(db));
    return router;
};