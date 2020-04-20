import {authenCache} from "./cache/authen-cache";
import {userInfo, userSearchHistory} from "./states/common";
import omit from "lodash/omit";

const initializeAuthenticateUser = ({userInfo: uInfo, authToken}) => {
    if(authToken){
        authenCache.setAuthen(authToken);
    }
    return Promise.all([
        userInfo.setState(omit(uInfo, "search_history")),
        userSearchHistory.setState(uInfo.search_history || [
            {
                _id: 1,
                content: "Dau xanh",
            }, {
                _id: 2,
                related_group: {
                    basic_info: {
                        name: "Group máy bay tìm phi công trẻ"
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
                    }
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