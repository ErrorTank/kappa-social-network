const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const Page = require("../model/page")(appDb);
const User = require("../model/user")(appDb);
const ChatRoom = require("../model/chat-room")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {binarySearch} = require("../../utils/common-utils");

const getChatContacts = (userID) => {
    return User.findOne({_id: ObjectId(userID)})
        .populate("friends.info")
        .then(user => {
            let {friends} =
                user;
            return friends.sort((a, b) => {

                return new Date(a.last_interact).getTime() - new Date(b.last_interact).getTime();
            }).slice(0, 10).map(each => ({
                ...(pick(each.info, ["_id", "basic_info", "avatar", "last_active_at", "active"]))
            }))
        })
};

const getGroupChatRoomInvolvesByKeyword = (chatRoomID, keyword = "") => {
    let pipeline = [{
        $match: {
            _id: ObjectId(chatRoomID)
        },

    }, {
        $unwind: "$involve_person"
    }, {
        $lookup: {
            from: 'users', localField: 'involve_person.related', foreignField: '_id', as: "involve_person.related"
        }
    }, {
        $project: {
            _id: {
                $arrayElemAt: ["$involve_person.related._id", 0]
            },
            nickname: "$involve_person.nickname",
            basic_info:{
                $arrayElemAt: ["$involve_person.related.basic_info", 0]
            },
        }
    }];

    return ChatRoom.aggregate(pipeline)


};

const createNewMessage = ({ chatRoomID, value}) => {
    let newMessage = {...value, _id: new ObjectId()}
    return ChatRoom.findOneAndUpdate({
        _id: ObjectId(chatRoomID)
    }, {
        $push: {
            context: newMessage
        }
    }, {
        new: true,
        fields: "context"
    })
        .lean()
        .then(data => data.context.find(each => each._id.toString() === newMessage._id.toString()))
};

const getChatRoomMessages = (chatRoomID, {take = 10, skip = 0}) => {
    return ChatRoom.aggregate([
        {$match: {_id: ObjectId(chatRoomID)}},
        {$unwind: "$context"},
        {
            $sort: {
                "context.created_at": -1
            }
        },
        {$skip: skip},
        {$limit: take},
        {
            $project: {
                context: "$context"
            }
        }
    ])
        .then(messages => {
            return messages.map(each => each.context)
        })
}

module.exports = {
    getChatContacts,
    getGroupChatRoomInvolvesByKeyword,
    createNewMessage,
    getChatRoomMessages
};