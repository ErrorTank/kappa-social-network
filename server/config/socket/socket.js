const {socketNamespaces} = require("./namespaces");
const {verifyToken} = require("../../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../../authorization/keys/keys");

const createNamespaceHandler = (io, nsp, context) => {
    let ioNamespace = io.nsps[nsp.path];

    let socketMap = {};
    if(nsp.authenticated){

        ioNamespace.on('connect', function(socket){

            if (!socket.auth) {
                console.log("Removing socket from", ioNamespace.name);
                if(nsp.connected)
                    delete nsp.connected[socket.id];
            }
        });
    }
    nsp.io.on('connection', function (socket) {

        socket.on('manual-disconnect', function({userID}){
            delete socketMap[userID];
            socket.auth = false;
            socket.disconnect();
            console.log("Manual disconnect ", socket.id);
        });
        if(nsp.authenticated){
            socket.auth = false;
            socket.on('authenticate', function(data){


                verifyToken(data.token, getPublicKey(), {algorithm: ["RS256"]})
                    .then((user) => {

                        socketMap[user._id] = socket;
                        console.log("Authenticated socket ", socket.id);
                        socket.auth = true;
                    });
            });

            setTimeout(function(){
                if (!socket.auth) {

                    console.log(socket.auth)
                    console.log("Disconnecting socket ", socket.id);
                    socket.disconnect('Unauthorized');
                }
            }, 1000);
        }

        require(nsp.handlers)(nsp.io, socket, context, {onDisconnect: ({userID}) => delete socketMap[userID]});
    });
    return {
        io: nsp.io,
        socketMap
    };
};

const createSocketNamespaces = (server, context) => {
    const io = require('socket.io')(server);
    const namespaces = socketNamespaces.map(({path, onConnect, onDisconnect, handlers, key, authenticated}) => ({
        io: io.of(path),
        onConnect,
        onDisconnect,
        handlers,
        key,
        authenticated,
        path
    }));

    return namespaces.reduce((result, nsp) => {
        result[nsp.key] = createNamespaceHandler(io, nsp, context);
        return result;
    }, {})
};

module.exports = {createSocketNamespaces};