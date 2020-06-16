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
const {getRandomToken} = require("../../utils/common-utils");

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
            basic_info: "$involve_person.related.basic_info",
        }
    }];

    return ChatRoom.aggregate(pipeline)

};

module.exports = {
    getChatContacts,
    getGroupChatRoomInvolvesByKeyword
};