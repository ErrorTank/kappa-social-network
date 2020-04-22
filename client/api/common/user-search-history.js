
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const userSearchHistoryApi = {
    addNewHistory(payload){
        return authenApi.post("/user/search-history/create", payload);
    },

};
