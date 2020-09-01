import { authenApi, offlineApi } from '../api';
import { urlUtils } from '../../common/utils/url-utils';

export const listingApi = {
  createListing(data) {
    return authenApi.post('/listing/create-listing', data);
  },
  getListing(data) {
    let category = urlUtils.buildParams(data);
    return authenApi.get(`/listing/get-listing${category}`);
  },
};
