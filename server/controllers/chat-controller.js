const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {asynchronized} = require("../utils/common-utils");
const {getChatContacts, getChatRoomNicknames,updateChatRoomDefaultEmoji, getGroupChatRoomInvolvesByKeyword, createNewMessage, updateUserNickname, getChatRoomMessages, updateSavedMessagesToSent, seenMessages} = require("../db/db-controllers/chat-room");
const {getUserBasicInfo} = require("../db/db-controllers/user");
const {MessageState} = require("../common/const/message-state")
const fileUpload = require("../common/upload-services/file-upload");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {isImage} = require("../utils/file-utils");

module.exports = (db, namespacesIO) => {
    router.get("/contacts", authorizationUserMiddleware, (req, res, next) => {

        return getChatContacts(req.user._id).then((data) => {

            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/:chatRoomID/mentions", authorizationUserMiddleware, (req, res, next) => {

        return getGroupChatRoomInvolvesByKeyword(req.params.chatRoomID, req.query.keyword).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/:chatRoomID/nicknames", authorizationUserMiddleware, (req, res, next) => {

        return getChatRoomNicknames(req.params.chatRoomID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/:chatRoomID/send-message", authorizationUserMiddleware, (req, res, next) => {

        return createNewMessage({value: req.body, chatRoomID: req.params.chatRoomID}).then((data) => {
            let result = data.toObject();
            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('new-message', {message: result, senderID: result.sentBy._id});
            return res.status(200).json({...result, oldID: req.body._id});
        }).catch(err => next(err));

    });
    router.post("/:chatRoomID/send-file-message", authorizationUserMiddleware, fileUpload.single("file"), (req, res, next) => {

        let file = req.file;
        let origin_path = `/uploads/${req.user._id}/${isImage(file.originalname) ? "image/" : "file/"}` + file.filename;
        return createNewMessage({
            value: {
                ...req.body,
                file: {name: file.originalname, origin_path, path: process.env.SERVER_HOST + origin_path}
            }, chatRoomID: req.params.chatRoomID
        }).then((data) => {
            let result = data.toObject();
            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('new-message', {message: result, senderID: result.sentBy._id});
            return res.status(200).json({...result, oldID: req.body._id});
        }).catch(err => next(err));

    });
    router.put("/:chatRoomID/messages/update-to-sent", authorizationUserMiddleware, (req, res, next) => {

        return updateSavedMessagesToSent(req.params.chatRoomID, req.body.messages.map(each => ObjectId(each._id))).then((data) => {

            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('change-message-state', {
                messageIDs: req.body.messages.map(each => each._id),
                state: MessageState.SENT
            });
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/:chatRoomID/messages/seen-messages", authorizationUserMiddleware, (req, res, next) => {

        return Promise.all([seenMessages(req.user._id, req.params.chatRoomID, req.body.messages.map(each => ObjectId(each._id))), getUserBasicInfo(req.user._id)]).then(([data, info]) => {

            namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('push-to-seen-by', {
                messageIDs: req.body.messages.map(each => each._id),
                user: info
            });
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/:chatRoomID/get-messages", authorizationUserMiddleware, (req, res, next) => {

        return getChatRoomMessages(req.params.chatRoomID, {take: req.query.take, skip: req.query.skip}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/:chatRoomID/user/:userID/nickname", authorizationUserMiddleware, (req, res, next) => {

        return updateUserNickname(req.params.chatRoomID, req.params.userID, req.body.value).then((data) => {
            return createNewMessage({
                chatRoomID: req.params.chatRoomID,
                value: {
                    content: "huh",
                    sentBy: ObjectId(req.user._id),
                    special: "NICKNAME",
                    special_data: {
                        to: ObjectId(req.params.userID),
                        value: req.body.value
                    },

                }
            }).then((newMsg) => {
                let result = newMsg.toObject();
                namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('new-message', {message: result, senderID: result.sentBy._id, forceUpdate: true});
                namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit("update-nicknames", {data: data.toObject().map(each => ({...each, related: each.related._id}))})
                return res.status(200).json(data);
            })

        }).catch(err => next(err));

    });
    router.put("/:chatRoomID/default-emoji", authorizationUserMiddleware, (req, res, next) => {

        return updateChatRoomDefaultEmoji(req.params.chatRoomID, req.body.value).then((data) => {
            return createNewMessage({
                chatRoomID: req.params.chatRoomID,
                value: {
                    content: "huh",
                    sentBy: ObjectId(req.user._id),
                    special: "EMOJI",
                    special_data: {
                        value: req.body.value
                    },

                }
            }).then((newMsg) => {

                let result = newMsg.toObject();
                namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit('new-message', {message: result, senderID: result.sentBy._id, forceUpdate: true});
                namespacesIO.messenger.to(`/messenger-chat-room/chat-room/${req.params.chatRoomID}`).emit("update-default-emoji", {data: data})
                return res.status(200).json(data);
            })

        }).catch(err => next(err));

    });
    return router;
};