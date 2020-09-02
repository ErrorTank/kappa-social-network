import { authenApi, offlineApi } from '../api';
import { urlUtils } from '../../common/utils/url-utils';

export const categoryApi = {
  getCategory(data) {
    let category = urlUtils.buildParams(data);
    return authenApi.get(`/category/get-category${category}`);
  },
};
