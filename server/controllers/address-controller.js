const express = require('express');
const router = express.Router();
const { authorizationUserMiddleware } = require('../common/middlewares/common');
const { asynchronized } = require('../utils/common-utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { getAddress } = require('../db/db-controllers/address');

module.exports = (db, namespacesIO) => {
  router.get('/get-address', authorizationUserMiddleware, (req, res, next) => {
    return getAddress(req.query)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  return router;
};
