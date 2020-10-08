const express = require("express");
const router = express.Router();
const { authorizationUserMiddleware } = require("../common/middlewares/common");
const { asynchronized } = require("../utils/common-utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  checkDatingProfile,
  createProfile,
  getCardProfileInfo,
  getInitCardProfileInfo,
  getLikeProfile,
  getMatchProfile,
  getUserProfile,
  getProfileByProfileID,
} = require("../db/db-controllers/dating");
module.exports = (db, namespacesIO) => {
  router.get(
    "/user/:userID/check-dating-profile",
    authorizationUserMiddleware,
    (req, res, next) => {
      return checkDatingProfile(req.params)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.post(
    "/user/:userID/create-profile",
    authorizationUserMiddleware,
    (req, res, next) => {
      return createProfile(req.body, req.params)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.put(
    "/card-profile-info",
    authorizationUserMiddleware,
    (req, res, next) => {
      console.log(1);
      return getCardProfileInfo(req.user._id, req.body)
        .then(([user, data]) => {
          if (req.body.action === "LIKE") {
            getProfileByProfileID(req.body.seenID).then((profile) => {
              namespacesIO.dating.io
                .to(`/dating-room/profile/${profile._id}`)
                .emit("be-liked", { profile: user });
            });
          }
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get(
    "/init-card-profile-info",
    authorizationUserMiddleware,
    (req, res, next) => {
      return getInitCardProfileInfo(req.user._id)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get("/like-profile", authorizationUserMiddleware, (req, res, next) => {
    return getLikeProfile(req.user._id)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  router.get(
    "/match-profile",
    authorizationUserMiddleware,
    (req, res, next) => {
      return getMatchProfile(req.user._id)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get("/user-profile", authorizationUserMiddleware, (req, res, next) => {
    return getUserProfile(req.user._id)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => next(err));
  });
  return router;
};
