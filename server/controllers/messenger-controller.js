const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getAllUserActiveRelations} = require("../db/db-controllers/messenger-utility");
const {simpleUpdateUser} = require("../db/db-controllers/user");

module.exports = (db, namespacesIO) => {
    router.get("/status/active/:status", authorizationUserMiddleware, (req, res, next) => {

        return Promise.all([simpleUpdateUser(req.user._id, {active: req.params.status === "true"}), getAllUserActiveRelations(req.user._id)]).then(([_ ,data]) => {
            let relationIds = data.map(each => each._id);
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};