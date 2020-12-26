const fs = require('fs');
const PeerServer = require('peer').PeerServer;
const path = require("path");

let server = null;

const initializePeerServer = ({environment, port, path: p}) => {
    console.log(path.join(
        __dirname,
        `../../ssl/${environment}/${process.env.SSL_KEY_PATH}`
    ))
    server = PeerServer({
        port,
        path: p,
        ssl: {
            key: fs.readFileSync(path.join(
                __dirname,
                `../../ssl/${environment}/${process.env.SSL_KEY_PATH}`
            ), 'utf-8'),
            cert: fs.readFileSync(path.join(
                __dirname,
                `../../ssl/${environment}/${process.env.SSL_KEY_PATH}`
            ), 'utf-8')
        }
    });
};


module.exports = {
    initializePeerServer,
    server
};