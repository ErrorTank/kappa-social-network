import {createStateHolder} from "./state-holder";


export const userInfo = createStateHolder();
export const userSearchHistory = createStateHolder([]);
export const userChatSettings = createStateHolder();
export const userFollowedPosts = createStateHolder([]);
export const userSavedPosts = createStateHolder([]);
export const userBlockedPosts = createStateHolder([]);

userInfo.onChange((nextState) => {
    clearAllData("user-info");
    writeData("user-info", nextState);
});


