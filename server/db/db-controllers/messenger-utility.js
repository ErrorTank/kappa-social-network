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
    return  User.aggregate([
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
                "chat_rooms":  { $map:
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


module.exports = {
    getAllUserActiveRelations,
    getUserBubbleChatBrief
};