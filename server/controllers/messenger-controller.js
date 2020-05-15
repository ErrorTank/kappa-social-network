const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getAllUserRelations} = require("../db/db-controllers/messenger-utility");

module.exports = (db, namespacesIO) => {
    router.get("/status/activate", authorizationUserMiddleware, (req, res, next) => {

        return getAllUserRelations(req.user._id).then((data) => {
            let relationIds = data.map(each => each._id);
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};