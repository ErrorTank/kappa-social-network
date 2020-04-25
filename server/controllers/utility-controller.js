const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {globalSearch, preSearch, getLoginSessionsBrief} = require("../db/db-controllers/utility");

module.exports = () => {
    router.get("/search-global", authorizationUserMiddleware, (req, res, next) => {
        return res.status(200).json([]);
        // return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
        //     return res.status(200).json(data);
        // }).catch(err => next(err));

    });
    router.get("/pre-search", authorizationUserMiddleware, (req, res, next) => {
        return preSearch(req.user._id, decodeURIComponent(req.query.keyword)).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/login-sessions/brief", (req, res, next) => {
        return getLoginSessionsBrief(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};