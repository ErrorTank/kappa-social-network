const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getChatContacts} = require("../db/db-controllers/chat-room");

module.exports = () => {
    router.get("/contacts", authorizationUserMiddleware, (req, res, next) => {

        return getChatContacts(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};