const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const Post = require("../model/post")(appDb);
const Comment = require("../model/comment")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {MessageState} = require("../../common/const/message-state")
const {REVERSE_REACTIONS} = require("../../utils/messenger-utils");

const createNewPost = (value) => {
    let newPost = {...value, _id: new ObjectId()};
    return Promise.all([new Post(newPost).save(), User.findOneAndUpdate({
        _id: ObjectId(value.belonged_person),
    }, {
        $push: {
            followed_posts: newPost._id
        }
    })])
        .then(newPost => {
            return newPost;
        })
};

const getAllPosts = ({userID, skip, limit}) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).lean()
        .then(user => {
            let {
                friends: _friends,
                page_blocked: _page_blocked,
                person_blocked: _person_blocked,
                blocked_posts: _blocked_posts,
                joined_groups: _joined_groups,
                group_blocked: _group_blocked,
                liked_pages: _liked_pages,
                followed_posts: _followed_posts
            } = user;
            // console.log(_friends)
            let friends = _friends.map(each => ObjectId(each.info));
            let page_blocked = _page_blocked.map(each => ObjectId(each));
            let person_blocked = _person_blocked.map(each => ObjectId(each));
            let blocked_posts = _blocked_posts.map(each => ObjectId(each));
            let joined_groups = _joined_groups.map(each => ObjectId(each));
            let group_blocked = _group_blocked.map(each => ObjectId(each));
            let liked_pages = _liked_pages.map(each => ObjectId(each));
            let followed_posts = _followed_posts.map(each => ObjectId(each));
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
                                        belonged_person: ObjectId(userID)
                                    },
                                    {
                                        belonged_person: {
                                            $in: friends
                                        }
                                    },
                                    {
                                        belonged_page: {
                                            $in: liked_pages
                                        }
                                    },
                                    {
                                        _id: {
                                            $in: followed_posts
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
                                            }, {
                                                belonged_person: ObjectId(userID)
                                            }
                                        ]
                                    },
                                ]
                            }
                        ]
                    }
                }, {
                    $addFields: {
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
                        "comments_count": {$size: "$comments"},
                        "reaction_count": {$add: ['$love_size', '$laugh_size', "$wow_size", "$cry_size", "$cry_size", "$angry_size", "$thump_up_size", "$thump_down_size"]}
                    }
                }, {
                    $sort: {
                        updated_at: -1,

                    }
                }, {
                    $skip: Number(skip)
                }, {
                    $limit: Number(limit)
                },
                {
                    "$addFields": {
                        "file_ids": {
                            "$reduce": {
                                "input": "$files",
                                "initialValue": [],
                                "in": {
                                    "$setUnion": ["$$value", {
                                        "$map": {
                                            "input": "$$this.tagged",
                                            "as": "el",
                                            "in": "$$el.related"
                                        }
                                    }]
                                }
                            }
                        }
                    }
                },

                {
                    "$lookup": {
                        "from": "users",
                        "localField": "file_ids",
                        "foreignField": "_id",
                        "as": "file_tags"
                    }
                },
                {
                    "$addFields": {
                        "files": {
                            "$map": {
                                "input": "$files",
                                "in": {
                                    "$mergeObjects": [
                                        "$$this",
                                        {
                                            "tagged": {
                                                "$map": {
                                                    "input": "$$this.tagged",
                                                    "in": {
                                                        "$mergeObjects": [
                                                            "$$this",
                                                            {
                                                                "related": {
                                                                    "$arrayElemAt": [
                                                                        "$file_tags",
                                                                        {"$indexOfArray": ["$file_ids", "$$this.related"]}
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {"$project": {"file_ids": 0, "file_tags": 0}},
                {
                    $lookup: {
                        from: 'pages', localField: 'belonged_page', foreignField: '_id', as: "belonged_page"
                    }
                }, {
                    $lookup: {
                        from: 'groups', localField: 'belonged_group', foreignField: '_id', as: "belonged_group"
                    }
                }, {
                    $lookup: {
                        from: 'users', localField: 'belonged_person', foreignField: '_id', as: "belonged_person"
                    }
                }, {
                    $lookup: {
                        from: 'users', localField: 'tagged', foreignField: '_id', as: "tagged"
                    }
                }, {
                    $addFields: {
                        "belonged_page": {
                            $arrayElemAt: ["$belonged_page", 0]
                        },
                        "belonged_group": {
                            $arrayElemAt: ["$belonged_group", 0]
                        },
                        "belonged_person": {
                            $arrayElemAt: ["$belonged_person", 0]
                        },
                        // "tagged": {
                        //     $arrayElemAt: ["$tagged", 0]
                        // },


                    }
                }, {
                    $project: {
                        "love_size": 0,
                        "laugh_size": 0,
                        "wow_size": 0,
                        "cry_size": 0,
                        "angry_size": 0,
                        "thump_up_size": 0,
                        "thump_down_size": 0,
                        "comments": 0
                    }
                }
            ])

        })
        .then((data) => {
            let sortedByComments = data.sort((a, b) => b.comments_count - a.comments_count);

            let sortedByReactions = data.sort((a, b) => b.reaction_count - a.reaction_count);

            return data.map((each, i) => ({
                ...each,
                belonged_page: each.belonged_page ? pick(each.belonged_page, ["_id", "avatar", "basic_info"]) : null,
                belonged_person: each.belonged_person ? pick(each.belonged_person, ["_id", "avatar", "basic_info"]) : null,
                belonged_group: each.belonged_group ? pick(each.belonged_group, ["_id", "basic_info"]) : null,
                tagged: each.tagged.map(tag => pick(tag, ["_id", "avatar", "basic_info"])),
                score: (data.length - i)
                    + (data.length - sortedByComments.findIndex(a => a._id.toString() === each._id.toString())) * 2 + (data.length - sortedByReactions.findIndex(a => a._id.toString() === each._id.toString())) * 2
            }))
                .sort((a, b) => b.score - a.score)
                .map(each => omit(each, "score"))
        })
}

const updateFilesInPost = ({postID, fileID, file}) => {
    return Post.findOneAndUpdate({
        _id: ObjectId(postID)
    }, {"$set": {"files.$[elem]": {...file}, "last_updated": Date.now()}}, {
        "arrayFilters": [{"elem._id": ObjectId(fileID)}],
        "multi": true,
        new: true
    }).then((data) => data)
}

const updatePost = ({postID, post}) => {
    return Post.findOneAndUpdate({
        _id: ObjectId(postID)
    }, {$set: {...post, last_updated: Date.now()}}, {new: true})
        .lean()

}

const updatePostReaction = ({postID, reactionConfig, userID}) => {
    let execCommand = {
        $set: {"last_updated": Date.now()}
    };

    let {on, off} = reactionConfig;
    if (on) {
        execCommand["$push"] = {
            [`reactions.${REVERSE_REACTIONS[on]}`]: ObjectId(userID)
        };

    }
    if (off) {
        execCommand["$pull"] = {
            [`reactions.${REVERSE_REACTIONS[off]}`]: ObjectId(userID)
        };
    }
    return Post.findOneAndUpdate({
        _id: ObjectId(postID)
    }, execCommand, {new: true}).lean()

}

const getPostReactionByReactionKey = ({postID, skip = 0, limit = 10, reactionKey}) => {
    return Post.aggregate([
        {
            $match: {
                _id: ObjectId(postID)
            }
        }, {
            $addFields: {
                "reactions": `$reactions.${REVERSE_REACTIONS[reactionKey]}`
            }
        },
        {
            $lookup: {
                "from": "users",
                "localField": "reactions",
                "foreignField": "_id",
                "as": "reactions"
            }
        },
        {
            $unwind: "$reactions"
        },
        {
            $project: {
                _id: "$reactions._id",
                basic_info: "$reactions.basic_info",
                avatar: "$reactions.avatar",
            }
        }
    ]).then(data => {
        let left = data.length - (Number(skip) + Number(limit));

        return {
            list: data.slice(Number(skip), Number(skip) + Number(limit)),
            left: left < 0 ? 0 : left
        }
    })
}

const getPostComments = ({postID, skip, limit}) => {
    return Comment.aggregate([
        {
            $match: {
                post: ObjectId(postID)
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "from_person",
                "foreignField": "_id",
                "as": "from_person"
            }
        },

        {
            "$lookup": {
                "from": "pages",
                "localField": "from_page",
                "foreignField": "_id",
                "as": "from_page"
            }
        },
        {
            "$lookup": {
                "from": "pages",
                "localField": "mentioned_page",
                "foreignField": "_id",
                "as": "mentioned_page"
            }
        },
        {
            $addFields: {
                "from_person": {
                    $arrayElemAt: ["$from_person", 0]
                },
                "from_page": {
                    $arrayElemAt: ["$from_page", 0]
                },
            }
        },
        {
            $addFields: {
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
        },
        {
            $addFields: {
                "reaction_count": {$add: ['$love_size', '$laugh_size', "$wow_size", "$cry_size", "$cry_size", "$angry_size", "$thump_up_size", "$thump_down_size"]}
            }
        }, {
            $sort: {
                "created_at": -1,
            }
        }
    ]).then(data => {
        let total = data.length;
        // console.log(data)
        return {
            list: data
                .slice(Number(skip), Number(skip) + Number(limit))
                .map(each => ({
                    ...each,
                    from_person: pick(each.from_person, ["_id", "basic_info", "avatar", "last_active_at", "active"]),
                    from_page: pick(each.from_page, ["_id", "basic_info", "avatar"]),
                    mentioned_page: each.mentioned_page.map(item => pick(item, ["_id", "basic_info", "avatar"])),
                })),
            total
        }

    })
}

const createNewCommentForPost = ({postID, comment, userID}) => {
    let newComment = {...comment, _id: new ObjectId(), from_person: ObjectId(userID), post: ObjectId(postID)}
    return Promise.all([Post.findOneAndUpdate({
        _id: ObjectId(postID)
    }, {
        $set: {
            last_updated: Date.now()
        },
        $addToSet: {
            comments: newComment._id
        }
    }, {
        new: true,
        fields: "comments",
    }), new Comment(newComment).save(), User.findOneAndUpdate({
        _id: ObjectId(newComment.from_person),
    }, {
        $addToSet: {
            followed_posts: newComment.post
        }
    })])
        .then(([_post, data]) => data)
}

const updatePostCommentReaction = ({postID, userID, commentID, reactionConfig}) => {
    let execCommand = {};

    let {on, off} = reactionConfig;
    if (on) {
        execCommand["$push"] = {
            [`reactions.${REVERSE_REACTIONS[on]}`]: ObjectId(userID)
        };

    }
    if (off) {
        execCommand["$pull"] = {
            [`reactions.${REVERSE_REACTIONS[off]}`]: ObjectId(userID)
        };
    }
    return Comment.findOneAndUpdate({
        _id: ObjectId(commentID)
    }, execCommand, {
        new: true
    }).lean()
        .then(comment => {
            // console.log(comment.context)
            // console.log(messageID)
            return comment
        })
}

const createCommentReply = ({postID, commentID, reply, userID}) => {
    let newReply = {...reply, _id: new ObjectId(), from_person: ObjectId(userID), post: ObjectId(postID)}
    return Promise.all([Comment.findOneAndUpdate({
        _id: ObjectId(commentID)
    }, {
        $set: {
            last_updated: Date.now()
        },
        $addToSet: {
            replies: newReply._id
        }
    }, {
        new: true,
    }), new Comment(newReply).save(), User.findOneAndUpdate({
        _id: ObjectId(newReply.from_person),
    }, {
        $addToSet: {
            followed_posts: newReply.post
        }
    })])
        .then(([_post, data]) => data)
}

const getCommentReplies = ({commentID, skip, limit}) => {
    return Comment.findOne({
        _id: ObjectId(commentID)
    }).lean()
        .then((cmt) =>
            Comment.aggregate([
                {
                    $match: {
                        _id: {
                            $in: cmt.replies.map(each => ObjectId(each))
                        }
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "from_person",
                        "foreignField": "_id",
                        "as": "from_person"
                    }
                },

                {
                    "$lookup": {
                        "from": "pages",
                        "localField": "from_page",
                        "foreignField": "_id",
                        "as": "from_page"
                    }
                },
                {
                    "$lookup": {
                        "from": "pages",
                        "localField": "mentioned_page",
                        "foreignField": "_id",
                        "as": "mentioned_page"
                    }
                },
                {
                    $addFields: {
                        "from_person": {
                            $arrayElemAt: ["$from_person", 0]
                        },
                        "from_page": {
                            $arrayElemAt: ["$from_page", 0]
                        },
                    }
                },
                {
                    $addFields: {
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
                },
                {
                    $addFields: {
                        "reaction_count": {$add: ['$love_size', '$laugh_size', "$wow_size", "$cry_size", "$cry_size", "$angry_size", "$thump_up_size", "$thump_down_size"]}
                    }
                }, {
                    $sort: {
                        "created_at": -1,
                    }
                }
            ]).then(data => {
                let total = data.length;
                // console.log(data)
                return {
                    list: data
                        .slice(Number(skip), Number(skip) + Number(limit))
                        .map(each => ({
                            ...each,
                            from_person: pick(each.from_person, ["_id", "basic_info", "avatar", "last_active_at", "active"]),
                            from_page: pick(each.from_page, ["_id", "basic_info", "avatar"]),
                            mentioned_page: each.mentioned_page.map(item => pick(item, ["_id", "basic_info", "avatar"])),
                        })),
                    total
                }

            }))
}
const deleteReply = ({replyID, commentID}) => {
    return Promise.all([
        Comment.findOneAndUpdate(
            {_id: ObjectId(commentID)},
            {
                $pull: {
                    replies: ObjectId(replyID)
                }
            }
        ),
        Comment.findOneAndDelete(
            {_id: ObjectId(replyID)}
        ),
        User.findOneAndUpdate({
            _id: ObjectId(value.belonged_person),
        }, {
            $pull: {
                followed_posts: newPost._id
            }
        })
    ])
}
const deleteComment = ({commentID, postID}) => {
    return Promise.all([
        Post.findOneAndUpdate(
            {_id: ObjectId(postID)},
            {
                $pull: {
                    comments: ObjectId(commentID)
                }
            }
        ),
        Comment.findOneAndDelete(
            {_id: ObjectId(commentID)}
        ),

    ])
}
const deletePost = ({postID,}) => {
    return Promise.all([Post.findOneAndDelete({
        _id: ObjectId(postID)
    }).lean(), Comment.find({post: ObjectId(postID)}).lean()])
        .then(([_post, comments]) => {
            // let replyIds = comments.reduce((total, cur) => [...total, ...cur.replies.map(each => ObjectId(each))], [])
            // console.log(replyIds)
            return Comment.deleteMany({
                $or: [
                    {
                        _id: {
                            $in: comments.map(each => ObjectId(each))
                        }
                    }
                ]
            })
        })

}

const updateComment = ({commentID, comment}) => {
    return Comment.findOneAndUpdate({
        _id: ObjectId(commentID)
    }, {$set: {...comment, last_updated: Date.now()}}, {new: true})
        .lean()

}

module.exports = {
    getAllPosts,
    createNewPost,
    updateFilesInPost,
    updatePost,
    updatePostReaction,
    getPostReactionByReactionKey,
    getPostComments,
    createNewCommentForPost,
    updatePostCommentReaction,
    createCommentReply,
    getCommentReplies,
    deleteReply,
    deleteComment,
    deletePost,
    updateComment
};