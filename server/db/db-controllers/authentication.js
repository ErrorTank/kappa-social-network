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
const {createNewConfirmToken} = require("./confirm-token");
const smsService = require("../../common/sms-service/sms-service");
const emailService = require("../../common/email-service/email-service");

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
            return new User(data).save()
                .then(nu => {
                    let newUser = nu.toObject();
                    return createNewConfirmToken({userID: newUser._id, registerType})
                        .then((credentials) => {
                            return {
                                credentials,
                                user: newUser
                        }
                        })

                })
                .then(({credentials, user}) => {
                    console.log(credentials)
                    if(credentials.register_type === "PHONE"){

                        return smsService.sendSms(
                            user.contact.login_username.phone,
                            `Mã xác nhận đăng ký tài khoản của bạn là: ${credentials.token}`
                        )
                            .then(() => credentials)
                            .catch(() => new ApplicationError("send_sms_failed"))
                    }

                })
                .then(credentials => ({
                    sessionID: credentials._id,
                    registerType: credentials.register_type
                }))

        })
};

const resendAccountConfirmationToken = ({userID, registerType}) => {

};

module.exports = {
    register,
    resendAccountConfirmationToken
};