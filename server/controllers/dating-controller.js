const express = require('express');
const router = express.Router();
const { authorizationUserMiddleware } = require('../common/middlewares/common');
const { asynchronized } = require('../utils/common-utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {checkDatingProfile} =require('../db/db-controllers/dating')

module.exports = (db, namespacesIO) => {
  router.get('/user/:userID/check-dating-profile', authorizationUserMiddleware, (req, res, next) => {
    return checkDatingProfile(req.params)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  return router;
};
