const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const mongoose = require("mongoose");
const {getUnverifiedUserRegisterType} = require("../../utils/user-utils");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");

const getAuthenticateUserInitCredentials = (userID) => {
    return User.findOne({_id: ObjectId(userID)}, "_id contact basic_info joined_at isVerify last_active_at dark_mode").lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("account_not_existed"))
            }

            return data;

        })

};

const login = ({login_username, password}) => {

    return User.findOne({
        $or: [
            {"contact.login_username.phone": login_username},
            {"contact.login_username.email": login_username},
        ]
    }, "_id contact basic_info joined_at isVerify last_active_at dark_mode private_info").lean()
        .then((data) => {
            if (!data || data.private_info.password !== password) {
                return Promise.reject(new ApplicationError("account_not_existed"));
            }

            if (!data.isVerify) {
                return Promise.reject(new ApplicationError("account_not_verified", {
                    userID: data._id,
                    registerType: getUnverifiedUserRegisterType(data)
                }));
            }
            return createAuthToken(pick(data, ["_id", "contact"]), getPrivateKey(), {
                algorithm: "RS256"
            }).then(token => {
                return {
                    token,
                    user: omit(data, "private_info")
                }
            })
        });
};

module.exports = {
    getAuthenticateUserInitCredentials,
    login
};