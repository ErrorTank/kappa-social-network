import { authenApi, offlineApi } from '../api';

export const listingApi = {
  createListing(data) {
    return authenApi.post(`/listing/create-listing`, data);
  },
};
