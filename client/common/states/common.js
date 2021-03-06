import { createStateHolder } from "./state-holder";

export const userInfo = createStateHolder();
export const userSearchHistory = createStateHolder([]);
export const userChatSettings = createStateHolder();
export const userFollowedPosts = createStateHolder([]);
export const userSavedPosts = createStateHolder([]);
export const userBlockedPosts = createStateHolder([]);
export const userBlockedPersons = createStateHolder([]);
export const datingProfile = createStateHolder(null);
export const marketplaceInfo = createStateHolder({});
export const matchedProfile = createStateHolder([]);

userInfo.onChange((nextState) => {
  clearAllData("user-info");
  writeData("user-info", nextState);
});
