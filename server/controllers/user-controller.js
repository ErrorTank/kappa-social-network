const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware, checkAuthorizeUser} = require("../common/middlewares/common");
const omit = require("lodash/omit");

const {getAuthenticateUserInitCredentials, getUserBasicInfo, login, sendChangePasswordToken, resendChangePasswordToken,createUserNotification,
    verifyChangePasswordToken, getChangePasswordUserBrief, changePassword, addNewSearchHistory, deleteSearchHistory,
    updateSearchHistory, shortLogin, simpleUpdateUser, getUnseenNotificationsCount, getUserNotifications, seenNotifications, } = require("../db/db-controllers/user");

module.exports = () => {
    router.get("/init-credentials", authorizationUserMiddleware, (req, res, next) => {

        return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/short-login", (req, res, next) => {

        return shortLogin(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/:userID/basic-info", (req, res, next) => {

        return getUserBasicInfo(req.params.userID, req.query).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/create-notification",authorizationUserMiddleware, (req, res, next) => {

        return createUserNotification({userID: req.user._id, ...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/seen-notifications",authorizationUserMiddleware, (req, res, next) => {

        return seenNotifications({userID: req.user._id, ...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/:userID/simple-update",authorizationUserMiddleware, checkAuthorizeUser ,(req, res, next) => {

        return simpleUpdateUser(req.user._id, omit(req.body, "_id")).then((data) => {
            return getUserBasicInfo(req.user._id)
                .then(user => res.status(200).json(user))
        }).catch(err => next(err));

    });
    router.get("/unseen-notifications-count",authorizationUserMiddleware, (req, res, next) => {

        return getUnseenNotificationsCount({userID: req.user._id}).then((data) => {
            return res.status(200).json({count: data});
        }).catch(err => next(err));

    });
    router.get("/notifications",authorizationUserMiddleware, (req, res, next) => {

        return getUserNotifications({userID: req.user._id, ...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/toggle-dark-mode", authorizationUserMiddleware, (req, res, next) => {

        return simpleUpdateUser(req.user._id, {dark_mode: req.body.value}).then((data) => {
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
    router.post("/search-history/create",authorizationUserMiddleware, (req, res, next) => {

        return addNewSearchHistory(req.user._id, req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.delete("/search-history/history/:historyID",authorizationUserMiddleware, (req, res, next) => {

        return deleteSearchHistory(req.user._id, req.params.historyID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/search-history/history/:historyID",authorizationUserMiddleware, (req, res, next) => {

        return updateSearchHistory(req.user._id, req.params.historyID, req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};