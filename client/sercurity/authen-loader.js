import {authenCache} from "../common/cache/authen-cache";
import {authenApi, faceApi} from "../api/api";

export const authenLoader = {
  init() {
    authenApi.addHeader("Authorization", () => {
      let token = authenCache.getAuthen();
      return token ? `Bearer ${token}` : null;
    });
    faceApi.addHeader("Authorization", () => {
      let token = authenCache.getAuthen();
      return token ? `Bearer ${token}` : null;
    });
    return authenCache.loadAuthen().then(result => {

      return Promise.resolve();
    }).catch(err => Promise.resolve())


  }
};
