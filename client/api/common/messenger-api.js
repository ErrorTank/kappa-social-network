
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const messengerApi = {

    sendActiveStatusToAllRelations(){
        return authenApi.get("/messenger/status/activate")
    }

};
