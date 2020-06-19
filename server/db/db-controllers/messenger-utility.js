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
const {simpleUpdateUser} = require("./user");
const pick = require("lodash/pick");

const getAllUserActiveRelations = (userID) => {
    return User.findOne({_id: ObjectId(userID)})
        .populate("friends.info")
        .then(user => {

            return user.friends.filter(each => each.info.active).map(each => each.info);
        })
};

const getUserPersonalChatRoom = (ownerID, userID, options = {}) => {
    let {omitFields} = options;
    return User.aggregate([
        {
            $match: {
                _id: ObjectId(ownerID)
            },
        },

        {$lookup: {from: 'chatrooms', localField: 'chat_rooms', foreignField: '_id', as: "chat_rooms"}},
        {
            $match: {
                "chat_rooms.is_group_chat": false,

            }
        },
        {
            $unwind: "$chat_rooms"
        },
        {
            $project: {
                "_id": "$_id",
                "chat_room_related": {
                    $map:
                        {
                            input: "$chat_rooms.involve_person",
                            as: "room",
                            in: "$$room"
                        }
                },
                "chat_room": "$chat_rooms"
            }
        },

        {
            $project: {
                "_id": "$_id",
                "chat_room": "$chat_room",
                "chat_room_related": {
                    $map:
                        {
                            input: "$chat_room_related",
                            as: "room",
                            in: "$$room.related"
                        }
                }
            }
        },

        {
            $match: {
                "chat_room_related": {
                    $all: [ObjectId(ownerID), ObjectId(userID)]
                },

            }
        },
    ])
        .then(data => {
            // console.log(data[0])
            return data.length ? omit(data[0].chat_room, omitFields || []) : null;
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
            console.log({
                ...user,
                latest_message: chat_room ? chat_room.context[chat_room.context.length - 1] : ""
            })
            return {
                ...user,
                latest_message: (chat_room && chat_room.context.length) ? chat_room.context[chat_room.context.length - 1] : ""
            };

        })

};

const getUserChatRoomBrief = (ownerID, userID) => {
    return Promise.all([
        getUserPersonalChatRoom(ownerID, userID, {omitFields: ["context"]}),
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
                    involve_person: [{related: ObjectId(ownerID)}, {related: ObjectId(userID)}],
                    context: [
                        {
                            is_init: true,
                            content: "nope"
                        }
                    ]
                }).save().then(cr => {
                    let newCr = cr.toObject();
                    Promise.all([simpleUpdateUser(ownerID, {$push: {chat_rooms: newCr._id}}), simpleUpdateUser(userID, {$push: {chat_rooms: newCr._id}})]);
                    return {chat_room: newCr}
                })
            }
            return ({chat_room})

        })
        // .then(({chatRoomID, user}) => {
        //
        // });
};

module.exports = {
    getAllUserActiveRelations,
    getUserBubbleChatBrief,
    getUserChatRoomBrief
};