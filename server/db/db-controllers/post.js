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
            let {_friends, _page_blocked, _person_blocked, _followed_posts, _blocked_posts, _joined_groups, _group_blocked} = user;
            let friends = _friends.map(each => ObjectId(each));
            let page_blocked = _page_blocked.map(each => ObjectId(each));
            let person_blocked = _person_blocked.map(each => ObjectId(each));
            let followed_posts = _followed_posts.map(each => ObjectId(each));
            let blocked_posts = _blocked_posts.map(each => ObjectId(each));
            let joined_groups = _joined_groups.map(each => ObjectId(each));
            let group_blocked = _group_blocked.map(each => ObjectId(each));
            return Post.aggregate([
                {
                    $match: {
                        $and: [

                            {
                                _id: {
                                    $nin: blocked_posts
                                }
                            },
                            {
                                belonged_person: {
                                    $nin: person_blocked
                                }
                            },
                            {
                                belonged_page: {
                                    $nin: page_blocked
                                },

                            },
                            {
                                belonged_group: {
                                    $nin: group_blocked
                                },
                            },
                            {
                                $or: [
                                    {
                                        belonged_person: {
                                            $in: friends
                                        }
                                    },
                                    {
                                        belonged_person: {
                                            $in: friends
                                        }
                                    },
                                    {
                                        belonged_group: {
                                            $in: joined_groups
                                        }
                                    },
                                    {
                                        policy: "PUBLIC"
                                    },
                                    {
                                        $and: [
                                            {
                                                policy: "PERSONAL",
                                            },{
                                                belonged_person: ObjectId(userID)
                                            }
                                        ]
                                    },{
                                        $and: [
                                            {
                                                policy: "FRIENDS",
                                            },{
                                                belonged_person: {
                                                    $in: friends
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                },{
                    $addFields: {
                        "comments_size": { $size: "$comments" },
                        "love_size": {
                            $size: "$reactions.love"
                        },
                        "laugh_size": {
                            $size: "$reactions.laugh"
                        },
                        "wow_size": {
                            $size: "$reactions.wow"
                        },
                        "cry_size": {
                            $size: "$reactions.cry"
                        },
                        "angry_size": {
                            $size: "$reactions.angry"
                        },
                        "thump_up_size": {
                            $size: "$reactions.thump_up"
                        },
                        "thump_down_size": {
                            $size: "$reactions.thump_down"
                        },
                    }
                }, {
                    $addFields: {
                        "comments_size": { $size: "$comments" },
                        "reaction_size": {$add : [ '$love_size', '$laugh_size', "$wow_size", "$cry_size", "$cry_size", "$angry_size", "$thump_up_size", "$thump_down_size" ]}
                    }
                }
            ])

        })
}


module.exports = {
    getAllPosts,
    createNewPost,

};