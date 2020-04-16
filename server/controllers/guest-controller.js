const express = require('express');
const router = express.Router();
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {register, sessionCheck, verifyUser, resendAccountConfirmationToken} = require("../db/db-controllers/authentication");

module.exports = () => {
    router.post("/register", (req, res, next) => {

        return register(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/session/check", (req, res, next) => {

        return sessionCheck(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/verify-user", (req, res, next) => {

        return verifyUser(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/confirm-token/resend", (req, res, next) => {

        return resendAccountConfirmationToken(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};