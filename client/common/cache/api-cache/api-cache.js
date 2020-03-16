export const createApiCache = (apiFn) => {
  let cacheData = null;
  return {
    get: async () =>{
      if(!cacheData){
        cacheData = await apiFn();

        return cacheData;
      }else{
        return cacheData;
      }
    },
    modifyCache(newCache = null){
      cacheData = newCache;
    },
    syncGet: () => {

      return cacheData;
    }
  }
};