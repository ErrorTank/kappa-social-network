
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const messengerApi = {

    sendActiveStatusToAllRelations(status){
        return authenApi.get("/messenger/status/active/" + status)
    },
    getUserBubbleBriefInfo(userID){
        return authenApi.get(`/messenger/bubble/user/${userID}/brief`)
    },
    getUserChatRoomBrief(userID){
        return authenApi.get(`/messenger/chat-room/user/${userID}/brief`)
    },
    getUserUnseenMessagesCount(userID){
        return authenApi.get(`/messenger/user/${userID}/unseen-messages/count`)
    },

};
