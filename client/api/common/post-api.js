

import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const postApi = {
    createNewPost(data) {
        return authenApi.post("/post/create-post", data);
    },
    preUploadMedia(data, fileKey) {
        return authenApi.postMultipart("/post/pre-upload-media", data, {fileKey});
    },
    getPostsForFeed({skip, limit}){
        return authenApi.get(`/post/get-all?skip=${skip}&limit=${limit}`)
    },
    updatePostFiles({postID, fileID, file}){
        return authenApi.put(`/post/update/post/${postID}/file/${fileID}`, {file})
    },
    updatePost(postID, post){
        return authenApi.put(`/post/update/post/${postID}`, {post})
    },
    updatePostReaction(postID, reactionConfig, userID){
        return authenApi.put(`/post/update-reaction/post/${postID}`, {reactionConfig, userID})
    },
    getPostReactionList(postID, reactionKey, skip = 0, limit = 10){
        return authenApi.get(`/post/reaction/post/${postID}/reaction_key/${reactionKey}?skip=${skip}&limit=${limit}`)
    },
    getCommentsForPost(postID, skip = 0, limit = 2){
        return authenApi.get(`/post/comments/post/${postID}?skip=${skip}&limit=${limit}`)
    },
    createComment(postID, comment){
        return authenApi.post(`/post/create-comment/post/${postID}`, {comment})
    },
    updateCommentReaction(postID, commentID, reactionConfig, userID){
        return authenApi.put(`/post/update-reaction/post/${postID}/comment/${commentID}`, {reactionConfig, userID})
    },
    createCommentReply(commentID, reply){
        return authenApi.post(`/post/create-reply/comment/${commentID}`, {reply})
    },
    getReplyForComment(commentID, {skip = 0, limit = 5}){
        return authenApi.get(`/post/replies/comment/${commentID}?skip=${skip}&limit=${limit}`)
    },
    deletePost(postID){
        return authenApi.delete(`/post/${postID}`)
    },
    deleteComment(postID, commentID){
        return authenApi.delete(`/post/${postID}/comment/${commentID}`)
    },
    deleteReply(commentID, replyID){
        return authenApi.delete(`/post/comment/${commentID}/reply/${replyID}`)
    },
    updateComment(commentID, comment){
        return authenApi.put(`/post/update-comment/comment/${commentID}`, {comment})
    }
};
