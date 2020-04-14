
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const guestApi = {
    register(data) {
        return offlineApi.post("/register", data);
    },
    resendAccountConfirmationToken(data) {
        return offlineApi.post("/confirm-token/resend", data);
    },
};
