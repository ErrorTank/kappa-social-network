
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const chatApi = {

    getChatContacts(){
        return authenApi.get("/chat/contacts")
            .catch((err) => {
                if(!err || !err.message){
                    return readAllData("contacts").then(data => data)

                }
                return Promise.reject(err);
            });
    }

};
