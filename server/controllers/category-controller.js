const express = require('express');
const {
  getRootCategories,
  getCategories,
  getCategoryByID,
} = require('../db/db-controllers/category');
const router = express.Router();
const { authorizationUserMiddleware } = require('../common/middlewares/common');
const { asynchronized } = require('../utils/common-utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (db, namespacesIO) => {
  router.get('/get-category', authorizationUserMiddleware, (req, res, next) => {
    return getCategories(req.query)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  router.get(
    '/get-category-by-ID/:categoryID',
    authorizationUserMiddleware,
    (req, res, next) => {
      return getCategoryByID(req.params.categoryID)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  return router;
};
