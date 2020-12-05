const dbManager = require("../../config/db");
const omit = require("lodash/omit");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const Profile = require("../model/dating/profile")(appDb);
const mongoose = require("mongoose");
const ChatBox = require("../model/dating/chatbox")(appDb);
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
  return new Profile({
    ...data,
    root_user: ObjectId(userID),
  })
    .save()
    .then((a) => {
      return a;
    });
};
const getCardProfileInfo = (userID, { seenID, action, exclude }) => {
  return Profile.findOneAndUpdate(
    {
      root_user: ObjectId(userID),
    },
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
                .concat(user.seen.map((x) => ObjectId(x.user.toString())))
                .concat(ObjectId(user._id)),
            },
          },
        },
        {
          $sample: {
            size: 1,
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "location.city",
            foreignField: "_id",
            as: "location.city",
          },
        },
        {
          $lookup: {
            from: "districts",
            localField: "location.district",
            foreignField: "_id",
            as: "location.district",
          },
        },
        {
          $lookup: {
            from: "wards",
            localField: "location.ward",
            foreignField: "_id",
            as: "location.ward",
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "homeTown.city",
            foreignField: "_id",
            as: "homeTown.city",
          },
        },
        {
          $lookup: {
            from: "districts",
            localField: "homeTown.district",
            foreignField: "_id",
            as: "homeTown.district",
          },
        },
        {
          $lookup: {
            from: "wards",
            localField: "homeTown.ward",
            foreignField: "_id",
            as: "homeTown.ward",
          },
        },
        {
          $addFields: {
            "location.city": {
              $arrayElemAt: ["$location.city", 0],
            },
            "location.district": {
              $arrayElemAt: ["$location.district", 0],
            },

            "location.ward": {
              $arrayElemAt: ["$location.ward", 0],
            },
            "homeTown.city": {
              $arrayElemAt: ["$homeTown.city", 0],
            },
            "homeTown.district": {
              $arrayElemAt: ["$homeTown.district", 0],
            },

            "homeTown.ward": {
              $arrayElemAt: ["$homeTown.ward", 0],
            },
          },
        },
      ]).then((data) => {
        return [user, data];
      });
    });
};
const getInitCardProfileInfo = (userID) => {
  return Profile.findOne({
    root_user: ObjectId(userID),
  })
    .lean()
    .then((user) => {
      return Profile.aggregate([
        {
          $addFields: {
            age: {
              $divide: [
                { $subtract: [new Date(), "$DateOfBirth"] },
                365 * 24 * 60 * 60 * 1000,
              ],
            },
          },
        },
        {
          $match: {
            gender: user.filterSetting.gender,
            educationLevel: user.filterSetting.educationLevel,
            yourKids: user.filterSetting.theirKids,
            religion: user.filterSetting.religion,
            $and: [
              {
                height: {
                  $gte: user.filterSetting.fromNumber,
                },
              },
              {
                height: {
                  $lte: user.filterSetting.toNumber,
                },
              },
            ],
            $and: [
              {
                age: {
                  $gte: user.filterSetting.fromAge,
                },
              },
              {
                age: {
                  $lte: user.filterSetting.toAge,
                },
              },
            ],
            _id: {
              $nin: user.seen
                .map((x) => ObjectId(x.user.toString()))
                .concat(ObjectId(user._id)),
            },
          },
        },
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [user.location.lat, user.location.lng],
            },
            distanceField: "dist.calculated",
            maxDistance: user.filterSetting.distance,
            // query: { category: "Parks" },
            includeLocs: "dist.location",
            spherical: true,
          },
        },

        {
          $sample: {
            size: 5,
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "location.city",
            foreignField: "_id",
            as: "location.city",
          },
        },
        {
          $lookup: {
            from: "districts",
            localField: "location.district",
            foreignField: "_id",
            as: "location.district",
          },
        },
        {
          $lookup: {
            from: "wards",
            localField: "location.ward",
            foreignField: "_id",
            as: "location.ward",
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "homeTown.city",
            foreignField: "_id",
            as: "homeTown.city",
          },
        },
        {
          $lookup: {
            from: "districts",
            localField: "homeTown.district",
            foreignField: "_id",
            as: "homeTown.district",
          },
        },
        {
          $lookup: {
            from: "wards",
            localField: "homeTown.ward",
            foreignField: "_id",
            as: "homeTown.ward",
          },
        },
        {
          $addFields: {
            "location.city": {
              $arrayElemAt: ["$location.city", 0],
            },
            "location.district": {
              $arrayElemAt: ["$location.district", 0],
            },

            "location.ward": {
              $arrayElemAt: ["$location.ward", 0],
            },
            "homeTown.city": {
              $arrayElemAt: ["$homeTown.city", 0],
            },
            "homeTown.district": {
              $arrayElemAt: ["$homeTown.district", 0],
            },

            "homeTown.ward": {
              $arrayElemAt: ["$homeTown.ward", 0],
            },
          },
        },
      ]).then((data) => data);
    });
};
const getLikeProfile = (userID) => {
  return Profile.findOne({
    root_user: ObjectId(userID),
  }).then((user) => {
    return Profile.find({
      "seen.user": ObjectId(user._id),
      "seen.action": "LIKE",
      _id: {
        $nin: user.seen.map((x) => x.user),
      },
    });
  });
};
const getMatchProfile = (userID) => {
  return Profile.findOne({
    root_user: ObjectId(userID),
  }).then((user) => {
    return Profile.find({
      "seen.user": ObjectId(user._id),
      "seen.action": "LIKE",
      _id: {
        $in: user.seen.filter((e) => e.action === "LIKE").map((e) => e.user),
      },
    });
  });
};
const getUserProfile = (userID) => {
  return Profile.findOne({
    root_user: ObjectId(userID),
  }).then((user) => {
    return user;
  });
};
const getProfileByProfileID = (profileID) => {
  return Profile.findOne({
    _id: ObjectId(profileID),
  })
    .lean()
    .then((user) => {
      return user;
    });
};
const getBasicChatBoxInfo = (user1, user2) => {
  return ChatBox.findOne({
    $or: [
      {
        user1: ObjectId(user1),
        user2: ObjectId(user2),
      },
      {
        user1: ObjectId(user2),
        user2: ObjectId(user1),
      },
    ],
  })
    .lean()
    .then((cb) => omit(cb, ["messages"]));
};
const createChatBox = (user1, user2) => {
  return new ChatBox({
    user1: ObjectId(user1),
    user2: ObjectId(user2),
  }).save();
};
const getChatBoxes = (profileId) => {
  return ChatBox.find({
    $or: [
      {
        user1: ObjectId(profileId),
      },
      {
        user2: ObjectId(profileId),
      },
    ],
  })
    .lean()
    .then((cbs) => {
      return cbs.map((cb) => {
        let sortedMessages = cb.messages.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return {
          user1: cb.user1,
          user2: cb.user2,
          _id: cb._id,
          lastestMessage: sortedMessages[0] || null,
        };
      });
    });
};
const getMessages = (chatBoxId, skip) => {
  const skipToNumber = Number(skip);
  return ChatBox.findOne({
    _id: chatBoxId,
  })
    .lean()
    .then((cb) => {
      return cb.messages
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(skipToNumber, skipToNumber + 15);
    });
};
const updateProfile = (data, profileId) => {
  console.log(data, "ok");
  return Profile.findOneAndUpdate(
    {
      _id: ObjectId(profileId),
    },
    data,
    {
      new: true,
    }
  )
    .lean()
    .then((profile) => {
      // console.log(comment.context)
      // console.log(messageID)
      console.log(profile);
      return profile;
    });
};
module.exports = {
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
};
