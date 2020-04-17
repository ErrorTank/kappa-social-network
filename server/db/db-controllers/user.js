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
const {createNewConfirmToken} = require("./confirm-token");
const smsService = require("../../common/sms-service/sms-service");
const emailService = require("../../common/email-service/email-service");

const sendResetPasswordToken = ({credentials, user}) => {
    if(credentials.register_type === "PHONE"){

        return smsService.sendSms(
            user.contact.login_username.phone,
            `Mã xác nhận đổi mật khẩu của bạn là: ${credentials.token}`
        )
            .then(() => credentials)
            .catch(() => Promise.reject(new ApplicationError("send_sms_failed")))
    }else{
        return emailService.sendEmail({
            from: "Kappa Support",
            to: user.contact.login_username.email,
            subject: "Xác nhận đổi mật khẩu",
            template: "reset-password",
            context: {
                name: `${user.basic_info.username}`,
                appUrl: `${process.env.APP_URI}`,
                email: `${user.contact.login_username.email}`,
                token: `${credentials.token}`
            }
        }).then(() => {

            return credentials;
        }).catch(err =>{
            return Promise.reject(new ApplicationError("send_email_failed"))
        })
    }

};

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

const sendChangePasswordToken = ({email = "", phone = ""}) => {
    let query = email ? {
        "contact.login_username.email": email,
    } : {
        "contact.login_username.phone": phone,
    };
    return User.findOne(query).lean()
        .then(data => {
            if(!data){
                return Promise.reject(new ApplicationError("account_not_existed"));
            }
            console.log(data);
            return createNewConfirmToken({
                userID: data._id,
                registerType: email ? "EMAIL" : "PHONE"
            }, "password")
                .then((credentials) => {
                    return {
                        credentials,
                        user: data
                    }
                })
                .then(sendResetPasswordToken)
                .then(credentials => ({
                    sessionID: credentials._id,
                    register_type: credentials.register_type,
                    user: pick(data, ["_id", "contact", "basic_info"])
                }))
        })

};

module.exports = {
    getAuthenticateUserInitCredentials,
    login,
    sendChangePasswordToken
};