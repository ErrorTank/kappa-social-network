import {authenCache} from "./cache/authen-cache";
import {userChatSettings, userInfo, userSearchHistory} from "./states/common";
import omit from "lodash/omit";
import { messengerIO} from "../socket/sockets";
import {messengerApi} from "../api/common/messenger-api";

const initializeAuthenticateUser = ({userInfo: uInfo, authToken}) => {
    if(authToken){
        authenCache.setAuthen(authToken, {expires: 7});
    }

    return Promise.all([
        userInfo.setState(omit(uInfo, ["search_history", "chat_settings"])),
        userSearchHistory.setState(uInfo.search_history),
        userChatSettings.setState(uInfo.chat_settings),
        messengerIO.connect({token: authToken})
            .then((appIO) => {
                messengerApi.sendActiveStatusToAllRelations(true);
                appIO.emit("join-own-room", {userID: uInfo._id});
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
    console.log("dasdas")

    return messengerApi.sendActiveStatusToAllRelations(false)
        .then(() => {
            authenCache.clearAuthen();
            messengerIO.disconnect();
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