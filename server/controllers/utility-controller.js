const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {globalSearch, preSearch} = require("../db/db-controllers/utility");

module.exports = () => {
    router.get("/search-global", authorizationUserMiddleware, (req, res, next) => {
        return res.status(200).json([]);
        // return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
        //     return res.status(200).json(data);
        // }).catch(err => next(err));

    });
    router.get("/pre-search", authorizationUserMiddleware, (req, res, next) => {
        return preSearch(req.user._id, req.query.keyword).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};