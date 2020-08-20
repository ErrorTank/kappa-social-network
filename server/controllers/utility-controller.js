const express = require('express');
const path = require('path');
const router = express.Router();
const {authorizationUserMiddleware, authorizationDownloadMiddleware} = require("../common/middlewares/common");
const {globalSearch, preSearch, getLoginSessionsBrief, searchRelated, searchFriends} = require("../db/db-controllers/utility");
const {fileUpload, tempImageUploader} = require('../common/upload-services/file-upload');
const urlMetadata = require('url-metadata')

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

    router.get("/download/:path/original-name/:name", authorizationDownloadMiddleware, (req, res, next) => {
        let p = path.resolve(process.cwd() + req.params.path)

        return res.download(p, req.params.name)

    });
    router.get("/url/:url/metadata", (req, res, next) => {
        return urlMetadata(decodeURIComponent(req.params.url)).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/search/dialogs", authorizationUserMiddleware, (req, res, next) => {
        return  searchRelated(req.user._id, req.query.keyword).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/search-for-create/dialogs", authorizationUserMiddleware, (req, res, next) => {
        return searchRelated(req.user._id, req.query.keyword).then((data) => {

            return res.status(200).json(data.contacts);
        }).catch(err => next(err));

    });
    router.get("/friends", authorizationUserMiddleware, (req, res, next) => {
        return searchFriends(req.user._id, req.query.keyword).then((data) => {

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