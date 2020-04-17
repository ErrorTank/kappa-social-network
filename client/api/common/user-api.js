
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const userApi = {
    getAuthenticateUserInitCredentials(){
        return authenApi.get("/user/init-credentials");
    },
    login(payload){
        return offlineApi.post("/user/login", payload);
    },
    sendChangePasswordToken(payload){
        return offlineApi.post("/user/send-change-password-token", payload);
    },
    verifyChangePasswordToken(payload){
        return offlineApi.post("/user/verify-change-password-token", payload);
    },
    resendResetPasswordToken(payload){
        return offlineApi.post("/user/resend-change-password-token", payload);
    },
};
