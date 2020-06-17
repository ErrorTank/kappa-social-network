const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {asynchronized} = require("../utils/common-utils");
const {getChatContacts, getGroupChatRoomInvolvesByKeyword, createNewMessage, getChatRoomMessages} = require("../db/db-controllers/chat-room");

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
    router.post("/:chatRoomID/send-message", authorizationUserMiddleware, (req, res, next) => {

        return createNewMessage({value: req.body, chatRoomID: req.params.chatRoomID}).then((data) => {
            return  res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/:chatRoomID/get-messages", authorizationUserMiddleware, (req, res, next) => {

        return getChatRoomMessages(req.params.chatRoomID, {take: req.query.take, skip: req.query.skip}).then((data) => {
            return  res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};