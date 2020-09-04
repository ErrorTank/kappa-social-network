const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require('../common/middlewares/common');
const {createNewPost, getAllPosts, updateFilesInPost, updatePost, updatePostReaction, getPostReactionByReactionKey,
    getPostComments, createNewCommentForPost, updatePostCommentReaction, createCommentReply, getCommentReplies, deleteComment, deletePost, deleteReply, updateComment, getPostByID} = require("../db/db-controllers/post");
const {toggleFollowPost, toggleSavePost, toggleBlockPost} = require('../db/db-controllers/user');
const {MessageState} = require('../common/const/message-state');
const {fileUploader} = require('../common/upload-services/file-upload');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {isImage} = require('../utils/file-utils');

module.exports = (db, namespacesIO) => {

    router.post("/create-post", authorizationUserMiddleware, (req, res, next) => {
        return createNewPost({
            ...req.body,
            belonged_person: req.user._id
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.delete("/:postID", authorizationUserMiddleware, (req, res, next) => {
        return deletePost({
            ...req.params,
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.delete("/:postID/comment/:commentID", authorizationUserMiddleware, (req, res, next) => {
        return deleteComment({
            ...req.params,
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.delete("/comment/:commentID/reply/:replyID", authorizationUserMiddleware, (req, res, next) => {
        return deleteReply({
            ...req.params,
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.post("/create-comment/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return createNewCommentForPost({
            ...req.body,
            ...req.params,
            userID: req.user._id
        }).then((data) => {
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
    router.post("/create-reply/post/:postID/comment/:commentID", authorizationUserMiddleware, (req, res, next) => {
        return createCommentReply({
            ...req.body,
            ...req.params,
            userID: req.user._id
        }).then((data) => {
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
    router.put("/update/post/:postID/file/:fileID", authorizationUserMiddleware, (req, res, next) => {
        return updateFilesInPost({
            ...req.params,
            ...req.body
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return updatePost({
            ...req.params,
            ...req.body
        }).then((data) => {
            namespacesIO.feedPost
                .to(`/post-room/${data._id}`)
                .emit('edit-post', data);
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/toggle-follow/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return toggleFollowPost({
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/toggle-save/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return toggleSavePost({
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/toggle-block/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return toggleBlockPost({
            ...req.params,
            userID: req.user._id
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update-comment/comment/:commentID", authorizationUserMiddleware, (req, res, next) => {
        return updateComment({
            ...req.params,
            ...req.body
        }).then((data) => {
            return res.status(200).json(data);
        })
            .catch((err) => next(err));

    })
    router.put("/update-reaction/post/:postID", authorizationUserMiddleware, (req, res, next) => {
        return updatePostReaction({
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
    router.put("/update-reaction/post/:postID/comment/:commentID", authorizationUserMiddleware, (req, res, next) => {
        return updatePostCommentReaction({
            ...req.params,
            ...req.body
        }).then((data) => {
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
