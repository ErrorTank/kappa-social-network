import {Cache} from "./cache";




export const loginSessionCache = (() => {
    const cache = new Cache();
    return {
        removeSession(userID) {
            let items = cache.get("recent-login-sessions");

            cache.set(items ? items.filter(each => each._id !== userID) : [], "recent-login-sessions");
        },
        getAllSessions(){
            return cache.get("recent-login-sessions")
        },
        addNewSession(payload) {
            let items = cache.get("recent-login-sessions");

            cache.set(items ? items.concat(payload) : [payload], "recent-login-sessions");
        },

        removeAllSessions() {

            cache.set([], "recent-login-sessions");
        }
    }
})();