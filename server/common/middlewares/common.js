const {authorization, decodeAuthRequest, decodeAuthDownloadRequest} = require("../../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../../authorization/keys/keys");
const {ApplicationError} = require("../../utils/error/error-types");
const authorizationUserMiddleware = authorization(getPublicKey(), {algorithm: ["RS256"]}, decodeAuthRequest);
const authorizationDownloadMiddleware = authorization(getPublicKey(), {algorithm: ["RS256"]}, decodeAuthDownloadRequest);

const checkAuthorizeUser = (req, res, next) => {
    console.log(req.user._id)
    console.log(req.params.userID)
    if(req.user._id === req.params.userID){
        next();
    }else{
        next(new ApplicationError());
    }

}

module.exports = {
    authorizationUserMiddleware,
    authorizationDownloadMiddleware,
    checkAuthorizeUser
};