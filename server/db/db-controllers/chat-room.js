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
const {MessageState} = require("../../common/const/message-state")

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
            basic_info: {
                $arrayElemAt: ["$involve_person.related.basic_info", 0]
            },
        }
    }];

    return ChatRoom.aggregate(pipeline)


};

const createNewMessage = ({chatRoomID, value}) => {
    let newMessage = {...value, _id: new ObjectId()}
    return ChatRoom.findOneAndUpdate({
        _id: ObjectId(chatRoomID)
    }, {
        $push: {
            context: {...newMessage, state: MessageState.SAVED}
        }
    }, {
        new: true,
        fields: "context"
    })

        .populate([
            {
                path: "context.sentBy",
                model: "User",
                select: "_id basic_info avatar last_active_at active"
            }, {
                path: "context.seenBy",
                model: "User",
                select: "_id basic_info avatar last_active_at active"

            }
        ])
        .then(data => data.context.find(each => each._id.toString() === newMessage._id.toString()))
};

const getChatRoomMessages = (chatRoomID, {take = 10, skip = 0}) => {

    return ChatRoom.aggregate([
        {$match: {_id: ObjectId(chatRoomID)}},

        {$unwind: "$context"},
        {$lookup: {from: 'users', localField: 'context.sentBy', foreignField: '_id', as: "context.sentBy"}},
        {
            $addFields: {
                "context.sentBy": {
                    $arrayElemAt: ["$context.sentBy", 0]
                }
            }
        },
        {
            $unwind: {
                path: "$context.seenBy",

                "preserveNullAndEmptyArrays": true
            }
        },

        {$lookup: {from: 'users', localField: 'context.seenBy', foreignField: '_id', as: "context.seenBy"}},
        {
            $addFields: {
                "context.seenBy": {
                    $arrayElemAt: ["$context.seenBy", 0]
                }
            }
        },
        {
            $group: {
                _id: "$context._id",
                sentBy: {
                    $first: "$context.sentBy"
                },
                seenBy: {
                    $push: "$context.seenBy"
                },
                replyFor: {
                    $first: "$context.replyFor"
                },
                state: {
                    $first: "$context.state"
                },
                created_at: {
                    $first: "$context.created_at"
                },
                content: {
                    $first: "$context.content"
                },
                photos: {
                    $first: "$context.photos"
                },
                mentions: {
                    $first: "$context.mentions"
                },
                files: {
                    $first: "$context.files"
                },
                videos: {
                    $first: "$context.videos"
                },
                hyperlinks: {
                    $first: "$context.hyperlinks"
                },
            }
        },
        {
            $sort: {
                "created_at": -1
            }
        },
        {$skip: Number(skip)},
        {$limit: Number(take)},

    ])
    .then(messages => {
        return messages.map(each => ({...each, seenBy:each.seenBy.map(seen => pick(seen, ["_id", "avatar", "basic_info", "last_active_at", "active"]))  ,sentBy: pick(each.sentBy, ["_id", "avatar", "basic_info", "last_active_at", "active"])})).reverse();
    })
}

const updateSavedMessagesToSent = (chatRoomID, messageIds) => {
    return ChatRoom.findOneAndUpdate({
        _id: ObjectId(chatRoomID)
    }, {"$set": {"context.$[elem].state": "SENT"}}, {
        "arrayFilters": [{"elem._id": {$in: messageIds}}],
        "multi": true,
        new: true
    })

};

const seenMessages = (userID, chatRoomID, messageIds) => {
    return ChatRoom.findOneAndUpdate({
        _id: ObjectId(chatRoomID)
    }, {"$push": {"context.$[elem].seenBy": ObjectId(userID)}}, {
        "arrayFilters": [{"elem._id": {$in: messageIds}, "elem.seenBy": {$ne: ObjectId(userID)}}],
        "multi": true,
        new: true
    })

};

module.exports = {
    getChatContacts,
    getGroupChatRoomInvolvesByKeyword,
    createNewMessage,
    getChatRoomMessages,
    updateSavedMessagesToSent,
    seenMessages
};