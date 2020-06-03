const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const Page = require("../model/page")(appDb);
const User = require("../model/user")(appDb);
const Group = require("../model/group")(appDb);
const ChatRoom = require("../model/chat-room")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");

const getAllUserActiveRelations = (userID) => {
    return User.findOne({_id: ObjectId(userID)})
        .populate("friends.info")
        .then(user => {

            return user.friends.filter(each => each.info.active).map(each => each.info);
        })
};

const getUserPersonalChatRoom = (ownerID, userID) => {
    return User.aggregate([
        {
            $match: {
                _id: ObjectId(ownerID)
            },
        },
        {$lookup: {from: 'chatRooms', localField: 'chat_rooms', foreignField: '_id', as: "chat_rooms"}},
        {
            $match: {
                "chat_rooms.is_group_chat": false,

            }
        },
        {
            $project: {
                "_id": "$_id",
                "chat_rooms": {
                    $map:
                        {
                            input: "$chat_rooms",
                            as: "room",
                            in: "$$room.related"
                        }
                }
            }
        },
        {
            $match: {
                "chat_rooms.related": {
                    $all: [ObjectId(ownerID), ObjectId(userID)]
                },

            }
        },
    ])
        .then(data => {
            return data ? data[0] : null;
        });
}

const getUserBubbleChatBrief = (ownerID, userID) => {
    return Promise.all([
        getUserPersonalChatRoom(ownerID, userID),
        User.findOne({
            _id: ObjectId(userID),
            "friends.info": ObjectId(ownerID)
        }, "_id basic_info.username active avatar last_active_at").lean()
    ])
        .then(([chat_room, user]) => {
            if (!user) {
                return Promise.reject(new ApplicationError("cannot_reach_out"));
            }

            return {
                ...user,
                latest_message: chat_room ? chat_room.context[chat_room.context.length - 1] : ""
            };

        })

};

const getUserChatRoomBrief = (ownerID, userID) => {
    return Promise.all([
        getUserPersonalChatRoom(ownerID, userID),
        User.findOne({
            _id: ObjectId(userID),
            "friends.info": ObjectId(ownerID)
        }, "_id basic_info.username active avatar last_active_at").lean()
    ])
        .then(([chat_room, user]) => {
            if (!user) {
                return Promise.reject(new ApplicationError("cannot_reach_out"));
            }
            if(!chat_room){
                return new ChatRoom({
                    involve_person: [ObjectId(ownerID), ObjectId(userID)],
                }).save().then(cr => ({chatRoomID: cr.toObject()._id, user}))
            }
            return ({chatRoomID: chat_room._id, user})

        })
        .then(({chatRoomID, user}) => {
            return ChatRoom.aggregate([
                {$match: {_id: ObjectId(chatRoomID)}},
                {$unwind: "$context"},
                {
                    $sort: {
                        "context.created_at": -1
                    }
                },
                {$limit: 10},
                {"$group": {"_id": "$_id",
                        "context": {"$push": "$context"},
                        "last_updated": {
                            $first: "$last_updated"
                        },
                        "last_active": {
                            $first: "$last_active"
                        },
                        "is_group_chat": {
                            $first: "$is_group_chat"
                        },
                        "involve_person": {
                            $first: "$involve_person"
                        },
                        "default_emoji": {
                            $first: "$default_emoji"
                        },
                        "involve_page": {
                            $first: "$involve_page"
                        },
                        "admins": {
                            $first: "$admins"
                        },
                        "group_name": {
                            $first: "$group_name"
                        },
                    }
                }
            ])
                .then(cr => {
                    return {
                        ...user,
                        chat_room: cr
                    };
                })
        });
};


module.exports = {
    getAllUserActiveRelations,
    getUserBubbleChatBrief,
    getUserChatRoomBrief
};