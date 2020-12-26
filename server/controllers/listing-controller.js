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
  deleteListing,
  saveListing,
  getSavedListing,
  updateStock,
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
      return getListingByCategoryID(req.params.categoryID, req.query)
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
    // console.log(req.body);
    return updateListing(req.body)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  router.delete(
    '/delete-listing/:listingID',
    authorizationUserMiddleware,
    (req, res, next) => {
      return deleteListing(req.params);
    }
  );
  router.put(
    '/save-listing/:listingID',
    authorizationUserMiddleware,
    (req, res, next) => {
      //  console.log(req.body);
      return saveListing({ ...req.body, ...req.params })
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get(
    '/get-saved-listing/:userID',
    authorizationUserMiddleware,
    (req, res, next) => {
      return getSavedListing(req.params.userID)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.put(
    '/update-stock/:listingID',
    authorizationUserMiddleware,
    (req, res, next) => {
      //  console.log(req.body);
      return updateStock({ ...req.body, ...req.params })
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  return router;
};
