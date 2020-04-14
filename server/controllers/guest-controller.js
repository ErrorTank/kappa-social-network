const express = require('express');
const router = express.Router();
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {register} = require("../db/db-controllers/authentication");

module.exports = () => {
    router.post("/register", (req, res, next) => {

        return register(req.body).then((data) => {
            return res.status(200).json(data[0]);
        }).catch(err => next(err));

    });
    return router;
};