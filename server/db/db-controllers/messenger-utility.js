const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const Page = require("../model/page")(appDb);
const User = require("../model/user")(appDb);
const Group = require("../model/group")(appDb);
const ChatRoom = require("../model/chat-room")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { ApplicationError } = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const { simpleUpdateUser } = require("./user");
const pick = require("lodash/pick");

const getAllUserActiveRelations = (userID) => {
  return User.findOne({ _id: ObjectId(userID) })
    .populate("friends.info")
    .then((user) => {
      return user.friends
        .filter((each) => each.info.active)
        .map((each) => each.info);
    });
};

const getUserPersonalChatRoom = (ownerID, userID, options = {}) => {
  let { omitFields } = options;
  return User.aggregate([
    {
      $match: {
        _id: ObjectId(ownerID),
      },
    },

    {
      $lookup: {
        from: "chatrooms",
        localField: "chat_rooms",
        foreignField: "_id",
        as: "chat_rooms",
      },
    },

    {
      $match: {
        "chat_rooms.is_group_chat": false,
      },
    },
    {
      $unwind: "$chat_rooms",
    },
    {
      $project: {
        _id: "$_id",
        chat_room_related: {
          $map: {
            input: "$chat_rooms.involve_person",
            as: "room",
            in: "$$room",
          },
        },
        chat_room: "$chat_rooms",
      },
    },

    {
      $project: {
        _id: "$_id",
        chat_room: "$chat_room",
        chat_room_related: {
          $map: {
            input: "$chat_room_related",
            as: "room",
            in: "$$room.related",
          },
        },
      },
    },

    {
      $match: {
        chat_room_related: {
          $all: [ObjectId(ownerID), ObjectId(userID)],
        },
      },
    },
  ]).then((data) => {
    return data.length ? omit(data[0].chat_room, omitFields || []) : null;
  });
};

const getUserBubbleChatBrief = (ownerID, userID) => {
  return Promise.all([
    getUserPersonalChatRoom(ownerID, userID),
    User.findOne(
      {
        _id: ObjectId(userID),
        // "friends.info": ObjectId(ownerID)
      },
      "_id basic_info.username active avatar last_active_at"
    ).lean(),
  ]).then(([chat_room, user]) => {
    if (!user) {
      return Promise.reject(new ApplicationError("cannot_reach_out"));
    }

    return {
      ...user,
      latest_message:
        chat_room && chat_room.context.length
          ? chat_room.context[chat_room.context.length - 1]
          : "",
      unseen_messages: ((chat_room && chat_room.context) || [])
        .filter(
          (each) =>
            (each.sentBy ? each.sentBy.toString() !== ownerID : false) &&
            !each.seenBy.find((each) => each.toString() === ownerID)
        )
        .map((each) => each._id),
    };
  });
};

const getUserChatRoomBrief = (ownerID, userID) => {
  return Promise.all([
    getUserPersonalChatRoom(ownerID, userID, { omitFields: ["context"] }),
    User.findOne(
      {
        _id: ObjectId(userID),
        // "friends.info": ObjectId(ownerID)
      },
      "_id basic_info.username active avatar last_active_at"
    ).lean(),
  ]).then(([chat_room, user]) => {
    if (!user) {
      return Promise.reject(new ApplicationError("cannot_reach_out"));
    }
    if (!chat_room) {
      let newID = ObjectId();
      return new ChatRoom({
        _id: newID,
        involve_person: [
          { related: ObjectId(ownerID) },
          { related: ObjectId(userID) },
        ],
        context: [
          {
            is_init: true,
            content: "nope",
          },
        ],
      })
        .save()
        .then((cr) => {
          let newCr = cr.toObject();
          console.log(newID);
          Promise.all([
            simpleUpdateUser(ownerID, {
              $push: { chat_rooms: ObjectId(newID) },
            }),
            simpleUpdateUser(userID, {
              $push: { chat_rooms: ObjectId(newID) },
            }),
          ]);
          return { chat_room: newCr };
        });
    }
    return { chat_room };
  });
  // .then(({chatRoomID, user}) => {
  //
  // });
};

const getUserUnseenMessagesCount = (userID) => {
  return User.aggregate([
    {
      $match: {
        _id: ObjectId(userID),
      },
    },
    {
      $lookup: {
        from: "chatrooms",
        localField: "chat_rooms",
        foreignField: "_id",
        as: "chat_rooms",
      },
    },
    { $unwind: "$chat_rooms" },
    {
      $group: {
        _id: "$chat_rooms._id",
        cr: {
          $first: "$chat_rooms",
        },
      },
    },
    {
      $unwind: "$cr.involve_person",
    },
    {
      $lookup: {
        from: "users",
        localField: "cr.involve_person.related",
        foreignField: "_id",
        as: "cr.involve_person.related",
      },
    },
    {
      $addFields: {
        "cr.involve_person.related": {
          $arrayElemAt: ["$cr.involve_person.related", 0],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        cr: {
          $first: "$cr",
        },
        last_updated: {
          $first: "$cr.last_updated",
        },
        involve_person: {
          $push: "$cr.involve_person",
        },
      },
    },
    
    
  ]).then((data) => {
    console.log(data.map(each => each.cr.context));
    return data.length;
  });
};

const getUserChatRooms = (userID, skip) => {
  return User.aggregate([
    {
      $match: {
        _id: ObjectId(userID),
      },
    },
    {
      $lookup: {
        from: "chatrooms",
        localField: "chat_rooms",
        foreignField: "_id",
        as: "chat_rooms",
      },
    },
    { $unwind: "$chat_rooms" },
    {
      $group: {
        _id: "$chat_rooms._id",
        cr: {
          $first: "$chat_rooms",
        },
      },
    },
    {
      $unwind: "$cr.involve_person",
    },
    {
      $lookup: {
        from: "users",
        localField: "cr.involve_person.related",
        foreignField: "_id",
        as: "cr.involve_person.related",
      },
    },
    {
      $addFields: {
        "cr.involve_person.related": {
          $arrayElemAt: ["$cr.involve_person.related", 0],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        cr: {
          $first: "$cr",
        },
        last_updated: {
          $first: "$cr.last_updated",
        },
        involve_person: {
          $push: "$cr.involve_person",
        },
      },
    },
    {
      $sort: {
        last_updated: -1,
      },
    },
    {
      $skip: Number(skip),
    },
  ]).then((data) => {
    return data.map((each) => {
      let contact = each.involve_person.find(
        (each) => each.related._id.toString() !== userID
      );
      let latestMessage = each.cr.context[each.cr.context.length - 1];
      return {
        _id: each._id,
        contact: {
          ...pick(contact.related, [
            "_id",
            "avatar",
            "basic_info",
            "active",
            "last_active_at",
          ]),
          nickname: contact.nickname,
        },
        latest_message: latestMessage,
        is_seen:
          !!latestMessage.seenBy.find((each) => each.toString() === userID) ||
          latestMessage.sentBy.toString() === userID,
      };
    });
  });
};

module.exports = {
  getAllUserActiveRelations,
  getUserBubbleChatBrief,
  getUserChatRoomBrief,
  getUserUnseenMessagesCount,
  getUserChatRooms,
};
