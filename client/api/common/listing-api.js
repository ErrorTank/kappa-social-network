import { authenApi, offlineApi } from '../api';

export const listingApi = {
  createListing(chatRoomID, messageContent) {
    return authenApi.post(`/chat/${chatRoomID}/send-message`, messageContent);
  },
};
