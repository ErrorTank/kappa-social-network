const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware,} = require('../common/middlewares/common');
const {checkReplyExistedMiddleware, checkPostExistedMiddleware, checkCommentExistedMiddleware} = require("../common/middlewares/post");
const {
    createNewPost, getAllPosts, updateFilesInPost, updatePost, updatePostReaction, getPostReactionByReactionKey,
    getPostComments, createNewCommentForPost, updatePostCommentReaction, createCommentReply, getCommentReplies, deleteComment, deletePost, deleteReply, updateComment, getLatestCommentsFromPost, getPostByID
    , getCommentByReply,getPostsByUserID
} = require("../db/db-controllers/post");
const {toggleFollowPost, toggleSavePost, toggleBlockPost, getMentionsUserByComment, getFollowedUserByPost, createUserNotification, getUserBasicInfo, getUserFriends} = require('../db/db-controllers/user');
const {MessageState} = require('../common/const/message-state');
const {fileUploader} = require('../common/upload-services/file-upload');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {isImage} = require('../utils/file-utils');
const uniq = require("lodash/uniq");
const pick = require("lodash/pick");

module.exports = (db, namespacesIO) => {

    router.post("/create-post", authorizationUserMiddleware, (req, res, next) => {
        return createNewPost({
            ...req.body,
            belonged_person: req.user._id
        }).then(([data, shared_post]) => {
            if (req.body.shared_post) {
                namespacesIO.feedPost
                    .socketMap[req.user._id]
                    .to(`/post-room/${req.body.shared_post}`)
                    .emit('edit-post', shared_post);
            }


            if(data.policy !== "PERSONAL"){
                if(data.belonged_wall && data.belonged_wall.notification_settings.includes("post_on_wall")){
                    createUserNotification({
                        type: "post_on_wall",
                        data: {post: data},
                        userID: data.belonged_wall._id.toString()
                    })
                        .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${data.belonged_wall._id.toString()}`).emit("notify-user", {notification}));
                }
                let filesTagged = uniq(data.files.reduce((total, cur) => [...total, ...cur.tagged.filter(each => each.related.notification_settings.includes("tagged_on_post")).map(each => ({
                    userID: each.related._id.toString(),
                    file: {...pick(cur, ["origin_path", "caption", "path", "name"]), rootFileID: cur._id}
                }))], []));

                if (filesTagged.length) {
                    for (let u of filesTagged) {
                        createUserNotification({
                            type: "tagged_on_post_file",
                            data: {post: data, file: u.file},
                            userID: u.userID
                        })
                            .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${u.userID}`).emit("notify-user", {notification}));

                    }

                }
                let postTagged = data.tagged.filter(each => each.notification_settings.includes("tagged_on_post")).map(each => each._id.toString()).filter(each => !filesTagged.find(t => t.userID === each)).filter(each => each !== req.user._id);

                if (postTagged.length) {
                    for (let u1 of postTagged) {
                        createUserNotification({type: "tagged_on_post", data: {post: data}, userID: u1})
                            .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${u1}`).emit("notify-user", {notification}));

                    }

                }
            }

            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.delete("/:postID", authorizationUserMiddleware, (req, res, next) => {
        return deletePost({
            ...req.params,
        }).then((data) => {
            namespacesIO.feedPost
                .socketMap[req.user._id]
                .to(`/post-room/${req.params.postID}`)
                .emit('delete-post', {postID: req.params.postID});
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.delete("/:postID/comment/:commentID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return deleteComment({
            ...req.params,
        }).then((data) => {

            namespacesIO.feedPost
                .socketMap[req.user._id]
                .to(`/post-room/${req.params.postID}`)
                .emit('delete-comment', {postID: req.params.postID, comment: {_id: req.params.commentID}});
            return res.status(200).json(data || []);
        })
            .catch((err) => next(err));

    })
    router.delete("/comment/:commentID/reply/:replyID", authorizationUserMiddleware, checkReplyExistedMiddleware, (req, res, next) => {
        return deleteReply({
            ...req.params,
        }).then((data) => {
            getCommentByReply({replyID: req.params.replyID}).then(comment => {
                namespacesIO.feedPost
                    .socketMap[req.user._id]
                    .to(`/post-room/${data.postID}`)
                    .emit('delete-reply', {postID: data.postID, comment, reply: {_id: req.params.replyID}});
            })

            return res.status(200).json(data.list);
        })
            .catch((err) => next(err));

    })
    router.post("/create-comment/post/:postID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return createNewCommentForPost({
            ...req.body,
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            Promise.all([
                getFollowedUserByPost(data.post),
                getMentionsUserByComment(data)
            ]).then(([followedUsers, mentionedUsers]) => {
                let fuIds = followedUsers.filter(each => each.notification_settings.includes("comment_on_comment_post")).map(each => each._id.toString()).filter(each => each !== req.user._id);
                let mIds = mentionedUsers.filter(each => each.notification_settings.includes("comment_on_comment_post")).map(each => each._id.toString()).filter(each => each !== req.user._id);


                for (let u1 of fuIds.filter(each => !mIds.find(f => f === each))) {
                    createUserNotification({
                        type: "comment_on_followed_post",
                        data: {comment: data._id, post: data.post},
                        userID: u1
                    })
                        .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${u1}`).emit("notify-user", {notification}));

                }

                for (let u2 of mIds) {
                    createUserNotification({
                        type: "mentioned_in_comment",
                        data: {comment: data._id, post: data.post},
                        userID: u2
                    })
                        .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${u2}`).emit("notify-user", {notification}));

                }

            })

            namespacesIO.feedPost
                .socketMap[req.user._id]
                .to(`/post-room/${req.params.postID}`)
                .emit('new-comment', ({postID: req.params.postID, comment: data}));
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.get("/detail/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return getPostByID({
            ...req.params,
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.post("/create-reply/post/:postID/comment/:commentID", authorizationUserMiddleware, checkCommentExistedMiddleware, (req, res, next) => {
        return createCommentReply({
            ...req.body,
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            getCommentByReply({replyID: data._id})
                .then(comment => {
                    Promise.all([
                        getPostByID({postID: data.post}),
                        getMentionsUserByComment(data)
                    ]).then(([post, mentionedUsers]) => {
                        let mentioned = mentionedUsers.filter(each => each.notification_settings.includes("comment_on_comment_post")).map(each => each._id.toString()).filter(each => each !== req.user._id.toString());
                        let receivers = uniq(comment.replies.filter(each => each.from_person.notification_settings.includes("comment_on_comment_post")).map(each => each.from_person._id.toString())
                            .concat(post.belonged_person.notification_settings.includes("comment_on_comment_post") ? post.belonged_person._id.toString() : [])
                            .filter(each => each !== req.user._id.toString())
                            .filter(each => !mentioned.find(u => u === each)));


                        for (let u1 of mentioned) {
                            createUserNotification({
                                type: "mentioned_in_reply",
                                data: {comment, post, reply: data},
                                userID: u1
                            })
                                .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${u1}`).emit("notify-user", {notification}));

                        }
                        console.log(comment.replies.map(each => ({
                            _id: each.from_person._id,
                            settings: each.from_person.notification_settings
                        })))

                        for (let u2 of receivers) {
                            createUserNotification({
                                type: "reply_on_comment",
                                data: {comment, post, reply: data},
                                userID: u2
                            })
                                .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${u2}`).emit("notify-user", {notification}));

                        }

                    })
                    namespacesIO.feedPost
                        .socketMap[req.user._id]
                        .to(`/post-room/${req.params.postID}`)
                        .emit('new-reply', ({postID: req.params.postID, reply: data, comment}));

                })
            return res.status(200).json(data);

        })
            .catch((err) => next(err));

    })
    router.get("/get-all", authorizationUserMiddleware, (req, res, next) => {
        return getAllPosts({
            userID: req.user._id,
            ...req.query
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.get("/user/:userID/get-all", authorizationUserMiddleware, (req, res, next) => {
        return getPostsByUserID(req.user._id, req.params.userID, {
            ...req.query
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update/post/:postID/file/:fileID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return updateFilesInPost({
            ...req.params,
            ...req.body
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update/post/:postID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return updatePost({
            ...req.params,
            ...req.body
        }).then((data) => {
            namespacesIO.feedPost
                .socketMap[req.user._id]
                .to(`/post-room/${data._id}`)
                .emit('edit-post', data);
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/toggle-follow/post/:postID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return toggleFollowPost({
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            if (data.actionType === "FOLLOWED") {
                namespacesIO.feedPost
                    .socketMap[req.user._id]
                    .join(`/notification-post-room/post/${req.params.postID}`);
            } else {
                namespacesIO.feedPost
                    .socketMap[req.user._id]
                    .leave(`/notification-post-room/post/${req.params.postID}`);
            }

            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/toggle-save/post/:postID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return toggleSavePost({
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/toggle-block/post/:postID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return toggleBlockPost({
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update-comment/comment/:commentID", authorizationUserMiddleware, checkCommentExistedMiddleware, (req, res, next) => {
        return updateComment({
            ...req.params,
            ...req.body
        }).then((data) => {
            if (data.is_reply) {
                getCommentByReply({replyID: req.params.commentID})
                    .then(comment => {
                        namespacesIO.feedPost
                            .socketMap[req.user._id]
                            .to(`/post-room/${data.post.toString()}`)
                            .emit('edit-reply', {reply: data, postID: data.post.toString(), comment});
                    })

            } else {
                namespacesIO.feedPost
                    .socketMap[req.user._id]
                    .to(`/post-room/${data.post.toString()}`)
                    .emit('edit-comment', {comment: data, postID: data.post.toString()});
            }

            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update-reaction/post/:postID", authorizationUserMiddleware, checkPostExistedMiddleware, (req, res, next) => {
        return updatePostReaction({
            ...req.params,
            ...req.body
        }).then((data) => {
            let reaction = req.body.reactionConfig;
            console.log(data)
            if (data.belonged_person._id.toString() !== req.user._id && reaction.on && data.belonged_person.notification_settings.includes("react_on_comment_post")) {
                createUserNotification({
                    type: "react_post",
                    data: {post: data, reacted_by: req.user._id, reaction: reaction.on},
                    userID: data.belonged_person._id
                })
                    .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${data.belonged_person._id}`).emit("notify-user", {notification}));
            }

            namespacesIO.feedPost
                .socketMap[req.user._id]
                .to(`/post-room/${data._id}`)
                .emit('edit-post', data);
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update-reaction/post/:postID/comment/:commentID", authorizationUserMiddleware, checkCommentExistedMiddleware, (req, res, next) => {
        return updatePostCommentReaction({
            ...req.params,
            ...req.body
        }).then((data) => {
            let reaction = req.body.reactionConfig;
            if (data.from_person._id.toString() !== req.user._id && reaction.on) {
                Promise.all([
                    getPostByID({postID: req.params.postID}),
                ])
                    .then(([post]) => {
                        if(data.from_person.notification_settings.includes("react_on_comment_post")){
                            createUserNotification({
                                type: "react_comment",
                                data: {comment: data.is_reply ? null : data, reply: data.is_reply ? data : null, post, reacted_by: req.user._id, reaction: reaction.on},
                                userID: data.from_person._id
                            })
                                .then(notification => namespacesIO.feedPost.io.to(`/feed-post-room/user/${data.from_person._id}`).emit("notify-user", {notification}));
                        }

                    })

            }

            namespacesIO.feedPost
                .socketMap[req.user._id]
                .to(`/post-room/${req.params.postID}`)
                .emit('reaction-cmt', {comment: data, postID: req.params.postID});
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.get("/reaction/post/:postID/reaction_key/:reactionKey", authorizationUserMiddleware, (req, res, next) => {
        return getPostReactionByReactionKey({
            ...req.params,
            ...req.query
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.get("/comments/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return getPostComments({
            ...req.params,
            ...req.query
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.get("/replies/comment/:commentID", authorizationUserMiddleware, (req, res, next) => {
        return getCommentReplies({
            ...req.params,
            ...req.query
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.post("/pre-upload-media", authorizationUserMiddleware, fileUploader.single("file"), (req, res) => {

        let file = req.file;
        let origin_path =
            `/uploads/${req.user._id}/${
                isImage(file.originalname) ? 'image/' : 'file/'
            }` + file.filename;
        return res.status(200).json({
            name: file.originalname,
            origin_path,
            path: process.env.SERVER_HOST + origin_path,
        });
    })
    return router;
};
