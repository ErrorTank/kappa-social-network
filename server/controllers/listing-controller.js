const express = require('express');
const router = express.Router();
const { authorizationUserMiddleware } = require('../common/middlewares/common');
const { asynchronized } = require('../utils/common-utils');
const mongoose = require('mongoose');
const { createListing } = require('../db/db-controllers/listing');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (db, namespacesIO) => {
  router.get(
    '/create-listing',
    authorizationUserMiddleware,
    (req, res, next) => {}
  );
  return router;
};
