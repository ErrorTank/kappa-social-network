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
const getCardProfileInfo = (userID, { seenID, action }) => {
  return Promise.all([
    Profile.count(),
    Profile.findOneAndUpdate(
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
    ).lean(),
  ]).then(([count, user]) => {
    console.log(user);
    console.log(userID);
    let random = Math.floor(Math.random() * (count - user.seen.length));
    return Profile.findOne({
      _id: {
        $nin: user.seen.map((x) => ObjectId(x.user.toString())),
      },
    }).skip(random);
  });
};
const getInitCardProfileInfo = () => {
  return Profile.count().then((count) => {
    let random = Math.floor(Math.random() * count);
    return Profile.findOne()
      .skip(random)
      .then((firstProfile) => {
        random = Math.floor(Math.random() * count);
        return Profile.findOne({
          _id: {
            $ne: ObjectId(firstProfile._id),
          },
        })
          .skip(random)
          .then((secondProfile) => {
            return [firstProfile, secondProfile];
          });
      });
  });
};
module.exports = {
  checkDatingProfile,
  createProfile,
  getCardProfileInfo,
  getInitCardProfileInfo,
};
