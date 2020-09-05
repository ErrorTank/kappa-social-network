import io from "socket.io-client";
import {userInfo} from "../common/states/common";

const createAppIO = (namespace) => {

    let appIO = null;
    let isConnected = false;

    return {
        connect: ({token}) => {
           return new Promise((res, rej) => {
               appIO = io(namespace);
               appIO.on('connect', () => {
                   isConnected = true;
                   if(token){
                       console.log("dit")
                       appIO.emit("authenticate", {token});

                   }
                   res(appIO);
               });
           })
        },
        getIOInstance: () => appIO,
        disconnect: () => {
            appIO.emit("manual-disconnect", {userID: userInfo.getState()._id});
            isConnected = false;
            appIO = null;
        },
        isConnected: () => isConnected,

    };

};

export const messengerIO = createAppIO(process.env.API_URI + "/messenger");
export const feedPostIO = createAppIO(process.env.API_URI + "/feed-post");


