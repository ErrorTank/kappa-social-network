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
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");
const {createAuthToken} = require("../../authorization/auth");

const sendAccountConfirmationToken = ({credentials, user}) => {
    if(credentials.register_type === "PHONE"){

        return smsService.sendSms(
            user.contact.login_username.phone,
            `Mã xác nhận đăng ký tài khoản của bạn là: ${credentials.token}`
        )
            .then(() => credentials)
            .catch(() => Promise.reject(new ApplicationError("send_sms_failed")))
    }else{
        return emailService.sendEmail({
            from: "Kappa Support",
            to: user.contact.login_username.email,
            subject: "Xác nhận đăng ký",
            template: "account-confirmation",
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

const register = (data) => {
    let registerType = data.contact.login_username.phone ? "PHONE" : "EMAIL";
    let userQuery = registerType === "PHONE" ?
        {"contact.login_username.phone": data.contact.login_username.phone} :
        {"contact.login_username.email": data.contact.login_username.email};
    return User.findOne(userQuery).lean()
        .then((user) => {
            if(user && user.isVerify){
                return Promise.reject(new ApplicationError("account_existed"));
            }
            if(user){
                return Promise.reject(new ApplicationError("account_not_verified", {userID: user._id, registerType: getUnverifiedUserRegisterType(user)}));
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
                .then(sendAccountConfirmationToken)
                .then(credentials => ({
                    sessionID: credentials._id,
                    registerType: credentials.register_type
                }))

        })
};


const resendAccountConfirmationToken = ({userID, registerType}) => {
    return User.findOne({_id: ObjectId(userID), isVerify: false}, "contact basic_info")
        .lean()
        .then((data) => {
            if(!data){
                return Promise.reject(new ApplicationError("user_not_existed"));
            }
            return createNewConfirmToken({userID, registerType})
                .then((credentials) => {
                    return {
                        credentials,
                        user: data
                    }
                })

        })
        .then(sendAccountConfirmationToken)
};

const sessionCheck = ({sessionID}) => {
    if(!ObjectId.isValid(sessionID)){
        return Promise.reject();
    }
    return ConfirmToken.findById(sessionID)
        .populate("user", "contact _id")
        .then(data => {
            if(!data){
                return Promise.reject();
            }
            return data;
        })
};

const verifyUser = ({token, sessionID}) => {
    console.log(token)
    console.log(sessionID)
    return ConfirmToken.findOne({
        token: token.toUpperCase(),
        _id: ObjectId(sessionID)
    }).lean()
        .then(data => {
            if(!data){
                return Promise.reject(new ApplicationError("wrong_token"))
            }
            return Promise.all([
                ConfirmToken.findOneAndDelete({_id: ObjectId(sessionID)}),
                User.findOneAndUpdate({_id: ObjectId(data.user)}, {$set: {isVerify: true}}, {new: true, select: "_id contact basic_info joined_at isVerify last_active_at dark_mode search_history"}).lean()
            ])
        })
        .then(([_, user]) => {
            console.log(user);
            return createAuthToken(pick(user, ["_id", "contact"]), getPrivateKey(), {
                algorithm: "RS256"
            }).then(token => {
                return {
                    token,
                    user
                }
            })
        })
};

module.exports = {
    register,
    resendAccountConfirmationToken,
    sessionCheck,
    verifyUser
};