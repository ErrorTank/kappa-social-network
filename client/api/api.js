import {apiFactory} from "./api-factory/api-config";



const authenApiConfig = {
    hostURL: `${process.env.APP_URI}/api`,


};

const offlineApiConfig = {
    hostURL: `${process.env.APP_URI}/api`
};


export const authenApi = apiFactory.createApi(authenApiConfig);

export const offlineApi = apiFactory.createApi(offlineApiConfig);

