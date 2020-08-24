

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
    }
};
