
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const userSearchHistoryApi = {
    addNewHistory(payload){
        return authenApi.post("/user/search-history/create", payload);
    },
    deleteHistory(historyID){
        return authenApi.delete("/user/search-history/history/" + historyID);
    },
    updateHistory(historyID, data){
        return authenApi.put("/user/search-history/history/" + historyID, data);
    }
};
