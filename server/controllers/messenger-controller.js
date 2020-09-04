const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getAllUserActiveRelations, getUserBubbleChatBrief, getUserChatRoomBrief, getUserUnseenMessagesCount, getUserChatRooms} = require("../db/db-controllers/messenger-utility");
const {simpleUpdateUser} = require("../db/db-controllers/user");

module.exports = (db, namespacesIO) => {
    router.get("/status/active/:status", authorizationUserMiddleware, (req, res, next) => {

        return Promise.all([simpleUpdateUser(req.user._id, {active: req.params.status === "true", last_active_at: new Date().getTime()}), getAllUserActiveRelations(req.user._id)]).then(([_ ,data]) => {
            let relationIds = data.map(each => each._id);
            for(let roomName of relationIds){
                console.log(`/messenger-user-room/user/${roomName}`)
                namespacesIO.messenger.io.to(`/messenger-user-room/user/${roomName}`).emit('change-contact-status', {userID: req.user._id, active: req.params.status === "true"});
            }
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/bubble/user/:userID/brief", authorizationUserMiddleware, (req, res, next) => {
        return getUserBubbleChatBrief(req.user._id, req.params.userID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/user/:userID/unseen-messages/count", authorizationUserMiddleware, (req, res, next) => {
        return getUserUnseenMessagesCount(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/user/:userID/chat-rooms", authorizationUserMiddleware, (req, res, next) => {
        return getUserChatRooms(req.user._id, req.query.skip).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/chat-room/user/:userID/brief", authorizationUserMiddleware, (req, res, next) => {
        return getUserChatRoomBrief(req.user._id, req.params.userID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};