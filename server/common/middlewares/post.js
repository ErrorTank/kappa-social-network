const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const Post = require("../../db/model/post")(appDb);
const Comment = require("../../db/model/comment")(appDb);
const mongoose = require("mongoose");
const {ApplicationError} = require("../../utils/error/error-types");
const ObjectId = mongoose.Types.ObjectId;

const checkPostExistedMiddleware = (req, res, next) => {
    let {postID} = req.params;
    Post.findOne({_id: ObjectId(postID)}).lean()
        .then(data => {
            if(data){
                next();
            }else{
                next(new ApplicationError("post_not_existed"));
            }
        })
}


const checkCommentExistedMiddleware = (req, res, next) => {
    let {commentID} = req.params;
    Comment.findOne({_id: ObjectId(commentID)}).lean()
        .then(data => {
            if(data){
                next();
            }else{
                next(new ApplicationError("comment_not_existed"));
            }
        })
}

const checkReplyExistedMiddleware = (req, res, next) => {
    let {replyID} = req.params;
    Comment.findOne({_id: ObjectId(replyID)}).lean()
        .then(data => {
            if(data){
                next();
            }else{
                next(new ApplicationError("reply_not_existed"));
            }
        })
}

module.exports = {
    checkPostExistedMiddleware,
    checkCommentExistedMiddleware,
    checkReplyExistedMiddleware
}