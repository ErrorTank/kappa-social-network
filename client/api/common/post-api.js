

import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const postApi = {
    createNewPost(data) {
        return authenApi.post("/post/create-post", data);
    },
    preUploadMedia(data, fileKey) {
        return authenApi.postMultipart("/post/pre-upload-media", data, {fileKey});
    },
    getPostsForFeed(){
        return authenApi.get(`/post/get-all`)
    }
};
