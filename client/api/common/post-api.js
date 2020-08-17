

import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const postApi = {
    createNewPost(data) {
        return offlineApi.post("/register", data);
    },


};
