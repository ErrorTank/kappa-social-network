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
};
