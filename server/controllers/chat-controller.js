const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {asynchronized} = require("../utils/common-utils");
const {getChatContacts, getGroupChatRoomInvolvesByKeyword, createNewMessage, getChatRoomMessages, updateSavedMessagesToSent, seenMessages} = require("../db/db-controllers/chat-room");
const {getUserBasicInfo} = require("../db/db-controllers/user");
const {MessageState} = require("../common/const/message-state")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('new-message', {message: data});
            return  res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/:chatRoomID/messages/update-to-sent", authorizationUserMiddleware, (req, res, next) => {

        return updateSavedMessagesToSent(req.params.chatRoomID, req.body.messages.map(each => ObjectId(each._id))).then((data) => {

            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('change-message-state', {messageIDs: req.body.messages.map(each => each._id), state: MessageState.SENT});
            return  res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/:chatRoomID/messages/seen-messages", authorizationUserMiddleware, (req, res, next) => {

        return Promise.all([seenMessages(req.user._id, req.params.chatRoomID, req.body.messages.map(each => ObjectId(each._id))), getUserBasicInfo(req.user._id)]).then(([data, info]) => {

            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('push-to-seen-by', {messageIDs: req.body.messages.map(each => each._id), user: info});
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