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

module.exports = {
  checkDatingProfile,
  createProfile,
};
