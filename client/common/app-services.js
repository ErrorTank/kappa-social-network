import {authenCache} from "./cache/authen-cache";
import {
    userBlockedPosts,
    userChatSettings,
    userFollowedPosts,
    userInfo,
    userSavedPosts,
    userSearchHistory
} from "./states/common";
import omit from "lodash/omit";
import {feedPostIO, messengerIO} from "../socket/sockets";
import {messengerApi} from "../api/common/messenger-api";
import {messageWidgetController} from "../react/layout/authen-layout/create-message-widget/create-message-widget";
import {CALL_TYPES, callServices} from "./call-services/call-services";
import {appModal} from "../react/common/modal/modals";

const initializeAuthenticateUser = ({userInfo: uInfo, authToken}) => {
    if (authToken) {
        authenCache.setAuthen(authToken, {expires: 7});
    }
    return Promise.all([
        userInfo.setState(omit(uInfo, ["search_history", "chat_settings"])),
        userSearchHistory.setState(uInfo.search_history),
        userChatSettings.setState(uInfo.chat_settings),
        userFollowedPosts.setState(uInfo.followed_posts),
        userSavedPosts.setState(uInfo.saved_posts),
        userBlockedPosts.setState(uInfo.blocked_posts),
        feedPostIO.connect({token: authToken || authenCache.getAuthen()}),
        messengerIO.connect({token: authToken || authenCache.getAuthen()})
            .then((messengerIO) => {

                messengerApi.sendActiveStatusToAllRelations(true);
                messengerIO.emit("join-own-room", {userID: uInfo._id});
                callServices.initClientID(uInfo._id);
                messengerIO.on("new-incoming-message", ({senderID}) => {
                    if (senderID) {
                        messageWidgetController.focusOnChatBox({
                            userID: senderID
                        })
                    }
                })
                messengerIO.on("request", ({from, callType}) => {
                    messengerIO.emit("ack-call", {friendID: from});

                    let openRequestModal = callServices.createIncomingModal(callType)
                    openRequestModal({
                        callFrom: from
                    }).then(result => {
                        if (result) {
                            if(!callServices.isCalling()){
                                messageWidgetController.focusOnChatBox({userID: from});
                                let openVoiceModal = callServices.createCallModal(callType)
                                openVoiceModal({isCaller: false, multiple: false, callTo: from})
                            }else{
                                appModal.alert({
                                    title: "Thông báo",
                                    text: "Bạn đang tham gia một cuộc gọi khác.",
                                    btnText: "Đóng",
                                })
                            }


                        } else {
                            if (result === false) {
                                messengerIO.emit('reject', {friendID: from});
                            }

                        }
                    });
                })
            })
        // userSearchHistory.setState([
        //     {
        //         _id: 1,
        //         content: "Dau xanh",
        //     }, {
        //         _id: 2,
        //         related_group: {
        //             basic_info: {
        //                 name: "Group máy bay tìm phi công trẻssssssssssssssssssssssssssssssssssssssss"
        //             }
        //         }
        //     }, {
        //         _id: 3,
        //         related_page: {
        //             basic_info: {
        //                 name: "Page thiên địa (thiendia.com)"
        //             }
        //         }
        //     }, {
        //         _id: 4,
        //         related_person: {
        //             basic_info: {
        //                 username: "Huấn hoa hồng"
        //             },
        //             avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTyBhPOufBhMuKyHyuJn242217FsWK_H3eEa-18CaNii30RG854&usqp=CAU"
        //         }
        //     },{
        //         _id: 11,
        //         related_person: {
        //             basic_info: {
        //                 username: "Mr Tam"
        //             },
        //         }
        //     },
        //     {
        //         _id: 5,
        //         content: "Dau xanh 2",
        //     },
        //     {
        //         _id: 6,
        //         content: "Dau xanh 3",
        //     }, {
        //         _id: 7,
        //         content: "Dau xanh 3",
        //     },
        // ])
    ]);
};

const clearAuthenticateUserSession = () => {

    return messengerApi.sendActiveStatusToAllRelations(false)
        .then(() => {

            authenCache.clearAuthen();
            messengerIO.disconnect();
            feedPostIO.disconnect();
            return Promise.all([
                userInfo.setState(null),
                userSearchHistory.setState([]),
                userChatSettings.setState(null),

            ]);
        });


};


export {
    initializeAuthenticateUser,
    clearAuthenticateUserSession
};