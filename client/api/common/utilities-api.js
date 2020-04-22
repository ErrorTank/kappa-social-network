
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const utilityApi = {
    searchGlobal(keyword){
        return authenApi.get("/utility/search-global?keyword=" + encodeURIComponent(keyword));
    },
    preSearch(keyword){
        return authenApi.get("/utility/pre-search?keyword=" + encodeURIComponent(keyword));
    }
};
