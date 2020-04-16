const {authorization, createAuthToken} = require("../../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../../authorization/keys/keys");

const authorizationUserMiddleware = authorization(getPublicKey(), {algorithm: ["RS256"]});

module.exports = {
    authorizationUserMiddleware
};