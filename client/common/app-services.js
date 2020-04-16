import {authenCache} from "./cache/authen-cache";
import {userInfo} from "./states/common";

const initializeAuthenticateUser = ({userInfo: uInfo, authToken}) => {
    authenCache.setAuthen(authToken);
    return Promise.all([
        userInfo.setState(uInfo),

    ]);
};

const clearAuthenticateUserSession = () => {
    authenCache.clearAuthen();
    return Promise.all([
        userInfo.setState(null)
    ]);
};

export {
    initializeAuthenticateUser,
    clearAuthenticateUserSession
};