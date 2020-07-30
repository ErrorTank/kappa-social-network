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
                last_interact: {
                    $first: "$friends.last_interact"
                }
            }
        }
    ];
    if (keyword) {
        pipelines = pipelines.concat([
            {
                $match: {
                    "info.basic_info.username":  { $regex: keyword, $options: "i" }
                }
            }
        ])
    }
    if(!keyword){
        pipelines = pipelines.concat([
            {
                $sort: {
                    "last_interact":  1
                }
            },
            {
                $limit: 10
            }
        ])
    }
    return User.aggregate(pipelines)
        .then(users => ({
            contacts: users.map(each => ({_id: each._id, ...pick(each.info, ["avatar", "basic_info"]), last_interact: each.last_interact}))
        }));
};

module.exports = {
    preSearch,
    getLoginSessionsBrief,
    searchRelated
};