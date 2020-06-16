const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {asynchronized} = require("../utils/common-utils");
const {getChatContacts, getGroupChatRoomInvolvesByKeyword} = require("../db/db-controllers/chat-room");

module.exports = (db, namespacesIO) => {
    router.get("/contacts", authorizationUserMiddleware, (req, res, next) => {

        return getChatContacts(req.user._id).then((data) => {
           return  res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/:chatRoomID/mentions", authorizationUserMiddleware, (req, res, next) => {

        return getGroupChatRoomInvolvesByKeyword(req.params.chatRoomID, req.query.keyword).then((data) => {
            return  res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};