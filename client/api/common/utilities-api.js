
import {authenApi, offlineApi} from "../api";
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
    getUrlMetadata(url){
        return offlineApi.get(`/utility/url/${encodeURIComponent(url)}/metadata`)
    }
};
