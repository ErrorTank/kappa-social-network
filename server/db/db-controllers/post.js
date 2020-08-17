const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const Post = require("../model/post")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {MessageState} = require("../../common/const/message-state")


const createNewPost = (value) => {

    return new Post(value)
        .save()
    .then(newPost => {
        return newPost;
    })
};


module.exports = {

    createNewPost,

};