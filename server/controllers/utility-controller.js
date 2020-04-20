const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {getAuthenticateUserInitCredentials, login, sendChangePasswordToken, resendChangePasswordToken, verifyChangePasswordToken, getChangePasswordUserBrief, changePassword} = require("../db/db-controllers/user");

module.exports = () => {
    router.get("/search-global", authorizationUserMiddleware, (req, res, next) => {
        return res.status(200).json([]);
        // return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
        //     return res.status(200).json(data);
        // }).catch(err => next(err));

    });

    return router;
};