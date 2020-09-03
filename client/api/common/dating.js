import { authenApi, offlineApi } from '../api';
import { urlUtils } from '../../common/utils/url-utils';
import user from '../../../server/db/model/user';

export const datingApi = {
  checkDatingProfile(userID) {
    return authenApi.get(`/dating/user/${userID}/check-dating-profile`);
  },
  
};

