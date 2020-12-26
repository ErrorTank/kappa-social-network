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
  getListingByCategoryID(categoryID, options) {
    return authenApi.get(
      `/listing/get-listing-by-categoryID/${categoryID}?sortBy=${options.sortBy}&orderBy=${options.orderBy}`
    );
  },
  getListingByUserID(userID) {
    return authenApi.get(`/listing/get-listing-by-userID/${userID}`);
  },
  getListingByListingID(listingID) {
    return authenApi.get(`/listing/get-listing-by-listingID/${listingID}`);
  },
  updateListing(data) {
    return authenApi.put(`/listing/edit-listing`, data);
  },
  deleteListing(listingID) {
    return authenApi.delete(`/listing/delete-listing/${listingID}`);
  },
  saveListing(userID, saveListingConfig, listingID) {
    return authenApi.put(`/listing/save-listing/${listingID}`, {
      userID,
      saveListingConfig,
    });
  },
  getSavedListing(userID) {
    return authenApi.get(`/listing/get-saved-listing/${userID}`);
  },
  updateStock(listingConfig, listingID) {
    return authenApi.put(`/listing/update-stock/${listingID}`, {
      listingConfig,
    });
  },
};
