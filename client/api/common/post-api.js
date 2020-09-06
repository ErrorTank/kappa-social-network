

import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {appModal} from "../../react/common/modal/modals";

const postApiErrorCatcher = result => {
    return result.catch(e => {
        let errMatcher = {
            "post_not_existed": "Bài đăng này",
            "comment_not_existed": "Bình luận này",
            "reply_not_existed": "Phản hồi này"
        }

        let content = errMatcher[e.message] ? errMatcher[e.message] + " không tồn tại hoặc đã bị xóa" : "Đã có lỗi xảy ra"
        appModal.alert({
            title: 'Thông báo',
            text: content,
            btnText: 'Đóng',
        })
        return Promise.reject()
    })
}

export const postApi = {
    createNewPost(data) {
        return postApiErrorCatcher(authenApi.post("/post/create-post", data));
    },
    preUploadMedia(data, fileKey) {
        return postApiErrorCatcher(authenApi.postMultipart("/post/pre-upload-media", data, {fileKey}));
    },
    getPostsForFeed({skip, limit}){
        return postApiErrorCatcher(authenApi.get(`/post/get-all?skip=${skip}&limit=${limit}`))
    },
    updatePostFiles({postID, fileID, file}){
        return postApiErrorCatcher(authenApi.put(`/post/update/post/${postID}/file/${fileID}`, {file}))
    },
    updatePost(postID, post){
        return postApiErrorCatcher(authenApi.put(`/post/update/post/${postID}`, {post}))
    },
    updatePostReaction(postID, reactionConfig, userID){
        return postApiErrorCatcher(authenApi.put(`/post/update-reaction/post/${postID}`, {reactionConfig, userID}))
    },
    getPostReactionList(postID, reactionKey, skip = 0, limit = 10){
        return postApiErrorCatcher(authenApi.get(`/post/reaction/post/${postID}/reaction_key/${reactionKey}?skip=${skip}&limit=${limit}`))
    },
    getCommentsForPost(postID, skip = 0, limit = 2){
        return postApiErrorCatcher(authenApi.get(`/post/comments/post/${postID}?skip=${skip}&limit=${limit}`))
    },
    createComment(postID, comment){
        return postApiErrorCatcher(authenApi.post(`/post/create-comment/post/${postID}`, {comment}))
    },
    updateCommentReaction(postID, commentID, reactionConfig, userID){
        return postApiErrorCatcher(authenApi.put(`/post/update-reaction/post/${postID}/comment/${commentID}`, {reactionConfig, userID}))
    },
    createCommentReply(postID, commentID, reply){
        return postApiErrorCatcher(authenApi.post(`/post/create-reply/post/${postID}/comment/${commentID}`, {reply}))
    },
    getReplyForComment(commentID, {skip = 0, limit = 5}){
        return postApiErrorCatcher(authenApi.get(`/post/replies/comment/${commentID}?skip=${skip}&limit=${limit}`))
    },
    deletePost(postID){
        return postApiErrorCatcher(authenApi.delete(`/post/${postID}`))
    },
    deleteComment(postID, commentID){
        return postApiErrorCatcher(authenApi.delete(`/post/${postID}/comment/${commentID}`))
    },
    deleteReply(commentID, replyID){
        return postApiErrorCatcher(authenApi.delete(`/post/comment/${commentID}/reply/${replyID}`))
    },
    updateComment(commentID, comment){
        return postApiErrorCatcher(authenApi.put(`/post/update-comment/comment/${commentID}`, {comment}))
    },
    toggleFollowPost(postID){
        return postApiErrorCatcher(authenApi.put(`/post/toggle-follow/post/${postID}`))
    },
    toggleBlockPost(postID){
        return postApiErrorCatcher(authenApi.put(`/post/toggle-block/post/${postID}`))
    },
    toggleSavedPost(postID){
        return postApiErrorCatcher(authenApi.put(`/post/toggle-save/post/${postID}`))
    },
    getPostByID(postID){
        return postApiErrorCatcher(authenApi.get(`/post/detail/post/${postID}`))
    }
};
