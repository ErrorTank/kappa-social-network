const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const Page = require("../model/page")(appDb);
const User = require("../model/user")(appDb);
const Group = require("../model/group")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {getRandomToken} = require("../../utils/common-utils");

const preSearch = (userID, keyword) => {
    if (!keyword) {
        return Promise.resolve([]);
    }
    return Promise.resolve([]);
};

const globalSearch = (userID, keyword) => {

};

const getLoginSessionsBrief = ({sessions}) => {
    return User.find({
        _id: {$in: sessions.map(each => ObjectId(each._id))}
    }, "_id avatar basic_info").lean()

};

const searchRelated = (userID, keyword = "") => {
    let pipelines = [
        {
            $match: {
                "_id": ObjectId(userID),
            }
        },
        {
            $lookup: {
                from: 'chatrooms', localField: 'chat_rooms', foreignField: '_id', as: "chat_rooms"
            }
        },
        // {
        //     $addFields: {
        //         "chat_rooms": {
        //             $arrayElemAt: ["$chat_rooms", 0]
        //         },
        //     }
        // },
        //TODO Do last update when interact with chat box
        {
            $unwind: "$friends"
        },
        {
            $lookup: {
                from: 'users', localField: 'friends.info', foreignField: '_id', as: "friends.info"
            }
        },

        {
            $addFields: {
                "friends.info": {
                    $arrayElemAt: ["$friends.info", 0]
                },
            }
        },
        {
            $group: {
                _id: "$friends.info._id",
                info: {
                    $first: "$friends.info"
                },
                user_chat_rooms: {
                    $first: "$chat_rooms"
                }
            }
        },

    ];
    if (keyword) {
        pipelines = pipelines.concat([
            {
                $match: {
                    "info.basic_info.username": {$regex: keyword, $options: "i"}
                }
            }
        ])
    }
    return User.aggregate(pipelines)
        .then(users => {

            return users.map(each => {
                // console.log(each.user_chat_rooms)
                return ({
                    _id: each._id, ...pick(each.info, ["avatar", "basic_info"]),
                    last_interact: each.user_chat_rooms.find(cr => !cr.is_group_chat && cr.involve_person.find(p => p.related.toString() === each._id.toString())).last_updated
                })
            }).sort((a,b) => new Date(a.last_interact).getTime() - new Date(b.last_interact).getTime())
        })
        .then(users => ({
            contacts: !keyword ? users.slice(0, 10) : users
        }))

};

const searchFriends = (userID, keyword) => {
    let pipelines = [
        {
            $match: {
                "_id": ObjectId(userID),
            }
        },
        {
            $lookup: {
                from: 'chatrooms', localField: 'chat_rooms', foreignField: '_id', as: "chat_rooms"
            }
        },
        {
            $unwind: "$friends"
        },
        {
            $lookup: {
                from: 'users', localField: 'friends.info', foreignField: '_id', as: "friends.info"
            }
        },

        {
            $addFields: {
                "friends.info": {
                    $arrayElemAt: ["$friends.info", 0]
                },
            }
        },
        {
            $group: {
                _id: "$friends.info._id",
                info: {
                    $first: "$friends.info"
                },
                user_chat_rooms: {
                    $first: "$chat_rooms"
                }
            }
        },

    ];
    if (keyword) {
        pipelines = pipelines.concat([
            {
                $match: {
                    "info.basic_info.username": {$regex: keyword, $options: "i"}
                }
            }
        ])
    }
    return User.aggregate(pipelines)
        .then(users => {
            // console.log(users)
            return users.map(each => {
                console.log(each.user_chat_rooms)
                let last_interact = each.user_chat_rooms.find(cr => !cr.is_group_chat && cr.involve_person.find(p => p.related.toString() === each._id.toString()));
                return ({
                    _id: each._id, ...pick(each.info, ["avatar", "basic_info"]),
                    last_interact: last_interact ? last_interact.last_updated : -1
                })
            }).sort((a,b) => new Date(b.last_interact).getTime() - new Date(a.last_interact).getTime())
        })
        .then(users => !keyword ? users.slice(0, 10) : users)
};

module.exports = {
    preSearch,
    getLoginSessionsBrief,
    searchRelated,
    searchFriends
};