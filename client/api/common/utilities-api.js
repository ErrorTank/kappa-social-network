
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const utilityApi = {
    searchGlobal(){
        return authenApi.get("/utility/search-global");
    },
};
