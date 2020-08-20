const {authorization, decodeAuthRequest, decodeAuthDownloadRequest} = require("../../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../../authorization/keys/keys");

const authorizationUserMiddleware = authorization(getPublicKey(), {algorithm: ["RS256"]}, decodeAuthRequest);
const authorizationDownloadMiddleware = authorization(getPublicKey(), {algorithm: ["RS256"]}, decodeAuthDownloadRequest);

module.exports = {
    authorizationUserMiddleware,
    authorizationDownloadMiddleware
};