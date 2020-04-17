const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getAuthenticateUserInitCredentials, login, sendChangePasswordToken} = require("../db/db-controllers/user");

module.exports = () => {
    router.get("/user/init-credentials", authorizationUserMiddleware, (req, res, next) => {

        return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/user/login", (req, res, next) => {

        return login(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/user/send-change-password-token", (req, res, next) => {

        return sendChangePasswordToken(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};