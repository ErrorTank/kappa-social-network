const dbManager = require("../../config/db");
const appDb= dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const ConfirmToken = require("../model/confirm-token")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {getUnverifiedUserRegisterType} = require("../../utils/user-utils");
const {getRandomToken} = require("../../utils/common-utils");

const register = (data) => {
    let registerType = data.contact.login_username.phone ? "PHONE" : "EMAIL";
    let userQuery = registerType === "PHONE" ?
        {"contact.login_username.phone": data.contact.login_username.phone} :
        {"contact.login_username.email": data.contact.login_username.email};
    return User.findOne(userQuery).lean()
        .then((user) => {
            if(user && user.isVerify){
                return new ApplicationError("account_existed");
            }
            if(user){
                return new ApplicationError("account_not_verified", {userID: user._id, registerType: getUnverifiedUserRegisterType(user)});
            }
            return new User(data)
                .then(nu => {
                    let newUser = nu.toObject();

                })

        })
};



module.exports = {
    register
};