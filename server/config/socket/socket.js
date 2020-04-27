const {socketNamespaces} = require("./namespaces");
const {verifyToken} = require("../../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../../authorization/keys/keys");

const createNamespaceHandler = (io, nsp, context) => {
    let ioNamespace = io.nsps[nsp.path];
    if(nsp.authenticated){

        ioNamespace.on('connect', function(socket){
            if (!socket.auth) {
                console.log("Removing socket from", ioNamespace.name);
                delete nsp.connected[socket.id];
            }
        });
    }
    nsp.io.on('connection', function (socket) {
        if(nsp.authenticated){
            socket.auth = false;
            socket.on('authenticate', function(data){
                verifyToken(data.token, getPublicKey(), {algorithm: ["RS256"]})
                    .then(() => {
                        console.log("Authenticated socket ", socket.id);
                        socket.auth = true;
                    });
            });

            setTimeout(function(){
                if (!socket.auth) {
                    console.log("Disconnecting socket ", socket.id);
                    socket.disconnect('Unauthorized');
                }
            }, 1000);
        }

        require(nsp.handlers)(nsp.io, socket, context);
    });
    return nsp.io;
};

const createSocketNamespaces = (server, context) => {
    const io = require('socket.io')(server);
    const namespaces = socketNamespaces.map(({path, onConnect, onDisconnect, handlers, key}) => ({
        io: io.of(path),
        onConnect,
        onDisconnect,
        handlers,
        key
    }));

    return namespaces.reduce((result, nsp) => {
        result[nsp.key] = createNamespaceHandler(io, nsp, context);
        return result;
    }, {})
};

module.exports = {createSocketNamespaces};