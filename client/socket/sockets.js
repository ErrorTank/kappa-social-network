import io from "socket.io-client";

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
                       appIO.emit("authenticate", {token});

                   }
                   res(appIO);
               });
           })
        },
        getIOInstance: () => appIO,
        disconnect: () => {
            appIO.emit("manual-disconnect");
            isConnected = false;
            appIO = null;
        },
        isConnected: () => isConnected,

    };

};

export const messengerIO = createAppIO(process.env.API_URI + "/messenger");


