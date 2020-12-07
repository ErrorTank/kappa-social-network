import { authenApi, offlineApi } from "../api";
import { urlUtils } from "../../common/utils/url-utils";
import user from "../../../server/db/model/user";

export const datingApi = {
  checkDatingProfile(userID) {
    return authenApi.get(`/dating/user/${userID}/check-dating-profile`);
  },
  getInheritUserInfor(userID) {
    return authenApi.get(`/user/${userID}/basic-info?full=true`);
  },
  createProfile(data, userID) {
    return authenApi.post(`/dating/user/${userID}/create-profile`, data);
  },
  getCardProfileInfo(seen) {
    return authenApi.put(`/dating/card-profile-info`, seen);
  },
  getInitCardProfileInfo() {
    return authenApi.get(`/dating/init-card-profile-info`);
  },
  getLikeProfile() {
    return authenApi.get(`/dating/like-profile`);
  },
  getMatchProfile() {
    return authenApi.get(`/dating/match-profile`);
  },
  getUserProfile() {
    return authenApi.get(`/dating/user-profile`);
  },
  getBasicChatboxInfor(user1, user2) {
    return authenApi.get(`/dating/basic-chatbox/user1/${user1}/user2/${user2}`);
  },
  getChatBoxesByProfileId(profileId) {
    return authenApi.get(`/dating/chatboxes/profileId/${profileId}`);
  },
  getMessages(chatBoxId, skip) {
    return authenApi.get(`/dating/chatbox/chatBoxId/${chatBoxId}?skip=${skip}`);
  },
  updateProfile(data, profileId) {
    return authenApi.put(`/dating/edit-profile/profileId/${profileId}`, data);
  },
  updateFilterSetting(data, profileId) {
    return authenApi.put(`/dating/update-filter/profileId/${profileId}`, data);
  },
};
