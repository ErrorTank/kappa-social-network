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

const getAllPosts = ({userID, skip, limit}) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).lean()
        .then(user => {
            let {_friends, _page_blocked, _person_blocked, _followed_posts, _blocked_posts, _joined_groups} = user;
            let friends = _friends.map(each => ObjectId(each));
            let page_blocked = _page_blocked.map(each => ObjectId(each));
            let person_blocked = _person_blocked.map(each => ObjectId(each));
            let followed_posts = _followed_posts.map(each => ObjectId(each));
            let blocked_posts = _blocked_posts.map(each => ObjectId(each));
            let joined_groups = _joined_groups.map(each => ObjectId(each));
            return Post.aggregate([
                {
                    $match: {
                        belonged_person: {
                            $nin: person_blocked
                        }

                    }
                }
            ])

        })
}


module.exports = {
    getAllPosts,
    createNewPost,

};