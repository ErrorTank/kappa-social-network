const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getAuthenticateUserInitCredentials, login, sendChangePasswordToken, resendChangePasswordToken, verifyChangePasswordToken, getChangePasswordUserBrief, changePassword} = require("../db/db-controllers/user");

module.exports = () => {
    router.get("/init-credentials", authorizationUserMiddleware, (req, res, next) => {

        return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/login", (req, res, next) => {

        return login(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/send-change-password-token", (req, res, next) => {

        return sendChangePasswordToken(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/resend-change-password-token", (req, res, next) => {

        return resendChangePasswordToken(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.post("/verify-change-password-token", (req, res, next) => {

        return verifyChangePasswordToken(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/change-password/brief/session/:sessionID", (req, res, next) => {

        return getChangePasswordUserBrief(req.params.sessionID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/change-password", (req, res, next) => {

        return changePassword(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};