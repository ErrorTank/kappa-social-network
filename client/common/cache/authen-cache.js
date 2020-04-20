import {Cache} from "./cache"
import Cookies from "js-cookie";
import {userInfo} from "../states/common";
import {userApi} from "../../api/common/user-api";
import {clearAuthenticateUserSession, initializeAuthenticateUser} from "../app-services";
import {customHistory} from "../../react/routes/routes";

const cookiesEngine = {
    getItem: Cookies.get,
    setItem: Cookies.set,
    removeItem: Cookies.remove
};


export const authenCache = (() => {
    const cache = new Cache(cookiesEngine);
    return {
        clearAuthen() {
            cache.set(null, "k-authen-token");
        },
        loadAuthen() {
            return new Promise((resolve, reject) => {
                let authen = cache.get("k-authen-token");
                if (!authen) {
                    reject();
                } else {
                    resolve();
                    userApi.getAuthenticateUserInitCredentials().then((user) => {
                        if (!user) {
                            reject();
                        } else {
                            return resolve(initializeAuthenticateUser({userInfo: user}));
                        }
                    }).catch(err => {
                        clearAuthenticateUserSession().then(() => {
                            customHistory.push("/");
                            reject();
                        });

                    });

                }
            });

        },
        getAuthen() {
            return cache.get("k-authen-token")
        },
        setAuthen(authen, options) {

            cache.set(authen, "k-authen-token", options);
        }
    }
})();
