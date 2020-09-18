
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const userApi = {
    getAuthenticateUserInitCredentials(){
        return authenApi.get("/user/init-credentials")
            .catch(err => {
                
                if(!err || !err.message){
                    return readAllData("user-info").then(data => data[0])

                }
                return Promise.reject(err);

            });
    },
    login(payload){
        return offlineApi.post("/user/login", payload);
    },
    updateUser(data){
        return authenApi.put(`/user/update`, data)
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
    createNotification(type, data){
        return  authenApi.post("/user/create-notification", {type, data})
    },
    getChangePasswordUserBrief(sessionID){
        return offlineApi.get("/user/change-password/brief/session/" + sessionID);
    },
    changePassword(sessionID ,newPassword){
        return offlineApi.put("/user/change-password", {newPassword, sessionID});
    },
    shortLogin(payload){
        return offlineApi.post("/user/short-login", payload);
    },
    toggleDarkMode(payload){
        return authenApi.put("/user/toggle-dark-mode", payload);
    },
    getUserBasicInfo(userID){
        return authenApi.get(`/user/${userID}/basic-info`);
    },
    getUnseenNotificationsCount(){
        return authenApi.get(`/user/unseen-notifications-count`);
    },
    getUserNotifications(skip){
        return authenApi.get(`/user/notifications?skip=${skip}`)
    },
    seenNotifications(ids){
        return authenApi.put(`/user/seen-notifications`, {notifications: ids})
    }
};
