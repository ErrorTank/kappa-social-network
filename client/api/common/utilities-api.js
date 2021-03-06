
import {authenApi, offlineApi, faceApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {guestApi} from "./guest-api";
import {authenCache} from "../../common/cache/authen-cache";

export const utilityApi = {
    searchGlobal(keyword){
        return authenApi.get("/utility/search-global?keyword=" + encodeURIComponent(keyword));
    },
    preSearch(keyword){
        return authenApi.get("/utility/pre-search?keyword=" + encodeURIComponent(keyword));
    },
    getLoginSessionBrief(sessions){
        return offlineApi.post("/utility/login-sessions/brief", {sessions})
    },
    searchForDialogsByKeyword(keyword){
        return authenApi.get(`/utility/search/dialogs?keyword=${keyword}`)
    },
    downloadFile(filePath, oriFileName){
        return Promise.resolve( window.open(process.env.API_URI + `/api/utility/download/${encodeURIComponent(filePath)}/original-name/${oriFileName}?token=${authenCache.getAuthen()}`))

    },
    searchDialogsForCreateByKeyword(keyword){
        return authenApi.get(`/utility/search-for-create/dialogs?keyword=${keyword}`)
    },
    searchFriends(keyword){
        return authenApi.get(`/utility/friends?keyword=${keyword}`)
    },
    getUrlMetadata(url){
        return offlineApi.get(`/utility/url/${encodeURIComponent(url)}/metadata`)
    },
    getGroupMentions(groupID, keyword){
        return offlineApi.get(`/utility/group-mentions/group/${groupID}?keyword=${keyword}`)
    },
    getPageMentions(pageID, keyword){
        return offlineApi.get(`/utility/page-mentions/page/${pageID}?keyword=${keyword}`)
    },
    detectImageFaces(file, {width, height}, fileKey){
        return faceApi.postMultipart(`/detect-faces`, {file, width, height}, {fileKey})
    },
    detectImageFaces2(filePath, {width, height}){
        return faceApi.post(`/detect-faces-2`, {filePath, width, height})
    }
};
