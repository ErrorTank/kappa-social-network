import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const chatApi = {

    getChatContacts() {
        return authenApi.get("/chat/contacts")
            .catch((err) => {
                if (!err || !err.message) {
                    return readAllData("contacts").then(data => data)

                }
                return Promise.reject(err);
            });
    },
    getMentionsByKeyword(roomChatID, keyword) {
        // return authenApi.get(`/chat/${roomChatID}/mentions?keyword=${keyword}`)
        return Promise.resolve([{
            _id: "1",
            name: "Huan hoa hong",
            basic_info: {
                username: "Con cac"
            },
            avatar: "https://image.thanhnien.vn/1080/uploaded/congnguyen/2019_09_09/huanhoahong-1_ugww.jpg",
            nickname: "Huan hoa hong"
        }, {
            _id: "2",
            name: "Tuan Anh",
            basic_info: {
                username: "Tuan Anh"
            },
            nickname: "Kappa"
        }])
    }

};
