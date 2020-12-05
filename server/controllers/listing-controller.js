const express = require('express');
const router = express.Router();
const { authorizationUserMiddleware } = require('../common/middlewares/common');
const { asynchronized } = require('../utils/common-utils');
const mongoose = require('mongoose');
const {
  createListing,
  getListing,
  getListingByCategoryID,
  getListingByUserID,
  getListingByListingID,
  updateListing,
} = require('../db/db-controllers/listing');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (db, namespacesIO) => {
  router.post(
    '/create-listing',
    authorizationUserMiddleware,
    (req, res, next) => {
      console.log(req.body);
      return createListing(req.body)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get('/get-listing', authorizationUserMiddleware, (req, res, next) => {
    return getListing(req.query)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  router.get(
    '/get-listing-by-categoryID/:categoryID',
    authorizationUserMiddleware,
    (req, res, next) => {
      return getListingByCategoryID(req.params.categoryID)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get(
    '/get-listing-by-userID/:userID',
    authorizationUserMiddleware,
    (req, res, next) => {
      return getListingByUserID(req.params.userID)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get(
    '/get-listing-by-listingID/:listingID',
    authorizationUserMiddleware,
    (req, res, next) => {
      return getListingByListingID(req.params.listingID)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.put('/edit-listing', authorizationUserMiddleware, (req, res, next) => {
    console.log(req.body);
    return updateListing(req.body)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  return router;
};
