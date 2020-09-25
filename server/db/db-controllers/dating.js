const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const Profile = require("../model/dating/profile")(appDb);
const mongoose = require("mongoose");
const profile = require("../model/dating/profile");

const ObjectId = mongoose.Types.ObjectId;

const checkDatingProfile = (arg) => {
  const { userID } = arg;
  return Profile.findOne({
    root_user: ObjectId(userID),
  })
    .lean()
    .then((profile) => {
      if (profile) {
        return profile;
      }
      return null;
    });
};
const createProfile = (data, { userID }) => {
  return new Profile({ ...data, root_user: ObjectId(userID) })
    .save()
    .then((a) => {
      return a;
    });
};
const getCardProfileInfo = (userID, { seenID, action, exclude }) => {
  return Profile.findOneAndUpdate(
    { root_user: ObjectId(userID) },
    {
      $push: {
        seen: {
          user: ObjectId(seenID),
          action,
        },
      },
    },
    {
      new: true,
    }
  )
    .lean()
    .then((user) => {
      return Profile.aggregate([
        {
          $match: {
            _id: {
              $nin: exclude
                .map((each) => ObjectId(each))
                .concat(user.seen.map((x) => ObjectId(x.user.toString()))),
            },
          },
        },
        { $sample: { size: 1 } },
      ]);
    });
};
const getInitCardProfileInfo = (userID) => {
  console.log(userID);
  return Profile.findOne({
    root_user: ObjectId(userID),
  })
    .lean()
    .then((user) => {
      return Profile.aggregate([
        {
          $match: {
            _id: {
              $nin: user.seen
                .map((x) => ObjectId(x.user.toString()))
                .concat(ObjectId(userID)),
            },
          },
        },
        { $sample: { size: 5 } },
      ]).then((data) => data);
    });
};
module.exports = {
  checkDatingProfile,
  createProfile,
  getCardProfileInfo,
  getInitCardProfileInfo,
};
