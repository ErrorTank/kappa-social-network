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
  getBasicChatBoxInfo,
  createChatBox,
  getChatBoxes,
  getMessages,
  updateProfile,
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
      return getCardProfileInfo(req.user._id, req.body)
        .then(([user, data]) => {
          getProfileByProfileID(req.body.seenID).then((profile) => {
            if (req.body.action === "LIKE") {
              let seen = profile.seen.map((each) => {
                return {
                  user: each.user.toString(),
                  action: each.action,
                };
              });
              console.log(seen);
              let isLiked = !!seen.find((each) => {
                return (
                  each.action === "LIKE" && each.user === user._id.toString()
                );
              });
              console.log(isLiked);
              if (isLiked) {
                createChatBox(user._id, profile._id).then(() => {
                  namespacesIO.dating.io
                    .to(`/dating-room/profile/${profile._id}`)
                    .emit("matched", {
                      profile: user,
                    });
                  namespacesIO.dating.io
                    .to(`/dating-room/profile/${user._id}`)
                    .emit("matched", {
                      profile,
                    });
                  namespacesIO.dating.io
                    .to(`/dating-room/profile/${profile._id}`)
                    .emit("matched-modal", {
                      profile: user,
                    });
                  namespacesIO.dating.io
                    .to(`/dating-room/profile/${user._id}`)
                    .emit("matched-modal", {
                      profile,
                    });
                });
              } else {
                namespacesIO.dating.io
                  .to(`/dating-room/profile/${profile._id}`)
                  .emit("be-liked", {
                    profile: user,
                  });
                namespacesIO.dating.io
                  .to(`/dating-room/profile/${profile._id}`)
                  .emit("be-liked-modal", {
                    profile: user,
                  });
              }
            }
          });

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
  router.get(
    "/basic-chatBox/user1/:user1/user2/:user2",
    authorizationUserMiddleware,
    (req, res, next) => {
      return getBasicChatBoxInfo(req.params.user1, req.params.user2)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get(
    "/chatBoxes/profileId/:profileId/",
    authorizationUserMiddleware,
    (req, res, next) => {
      return getChatBoxes(req.params.profileId)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.get(
    "/chatbox/chatBoxId/:chatBoxId/",
    authorizationUserMiddleware,
    (req, res, next) => {
      return getMessages(req.params.chatBoxId, req.query.skip)
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );
  router.put(
    "/edit-profile/profileId/:profileId",
    authorizationUserMiddleware,
    (req, res, next) => {
      console.log("ok");
      return updateProfile(req.body, req.params.profileId)
        .then((data) => {
          console.log("ok");
          return res.status(200).json(data);
        })
        .catch((err) => next(err));
    }
  );

  return router;
};
