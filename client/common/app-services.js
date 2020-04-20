import {authenCache} from "./cache/authen-cache";
import {userInfo, userSearchHistory} from "./states/common";
import omit from "lodash/omit";

const initializeAuthenticateUser = ({userInfo: uInfo, authToken}) => {
    if(authToken){
        authenCache.setAuthen(authToken);
    }
    return Promise.all([
        userInfo.setState(omit(uInfo, "search_history")),

        userSearchHistory.setState([
            {
                _id: 1,
                content: "Dau xanh",
            }, {
                _id: 2,
                related_group: {
                    basic_info: {
                        name: "Group máy bay tìm phi công trẻssssssssssssssssssssssssssssssssssssssss"
                    }
                }
            }, {
                _id: 3,
                related_page: {
                    basic_info: {
                        name: "Page thiên địa (thiendia.com)"
                    }
                }
            }, {
                _id: 4,
                related_person: {
                    basic_info: {
                        username: "Huấn hoa hồng"
                    },
                    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTyBhPOufBhMuKyHyuJn242217FsWK_H3eEa-18CaNii30RG854&usqp=CAU"
                }
            },{
                _id: 11,
                related_person: {
                    basic_info: {
                        username: "Mr Tam"
                    },
                }
            },
            {
                _id: 5,
                content: "Dau xanh 2",
            },
            {
                _id: 6,
                content: "Dau xanh 3",
            }, {
                _id: 7,
                content: "Dau xanh 3",
            },
        ])
    ]);
};

const clearAuthenticateUserSession = () => {
    authenCache.clearAuthen();
    return Promise.all([
        userInfo.setState(null),
        userSearchHistory.setState([])
    ]);
};

export {
    initializeAuthenticateUser,
    clearAuthenticateUserSession
};