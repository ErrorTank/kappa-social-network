import { authenApi, offlineApi } from '../api';
import { urlUtils } from '../../common/utils/url-utils';

export const addressApi = {
  getAddress(obj) {
    let address = urlUtils.buildParams(obj);
    // return Promise.resolve(address);
    return authenApi.get(`/address/get-address${address}`);
  },
};