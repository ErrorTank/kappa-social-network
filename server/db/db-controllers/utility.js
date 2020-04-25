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
   if(!keyword){
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

module.exports = {
    preSearch,
    getLoginSessionsBrief
};