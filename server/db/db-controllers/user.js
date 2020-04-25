const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const ResetPasswordToken = require("../model/reset-password-token")(appDb);
const mongoose = require("mongoose");
const {getUnverifiedUserRegisterType} = require("../../utils/user-utils");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");
const {createNewConfirmToken} = require("./confirm-token");
const {twilioSmsService} = require("../../common/sms-service/sms-service");
const emailService = require("../../common/email-service/email-service");

const sendResetPasswordToken = ({credentials, user}) => {
    if (credentials.register_type === "PHONE") {

        return twilioSmsService.sendSms(
            user.contact.login_username.phone,
            `Mã xác nhận đổi mật khẩu của bạn là: ${credentials.token}`
        )
            .then(() => credentials)
            .catch(() => Promise.reject(new ApplicationError("send_sms_failed")))
    } else {
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
        }).catch(err => {
            return Promise.reject(new ApplicationError("send_email_failed"))
        })
    }

};

const getAuthenticateUserInitCredentials = (userID) => {
    return User.findOne({_id: ObjectId(userID)}, "_id contact basic_info joined_at isVerify last_active_at dark_mode search_history").lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("account_not_existed"))
            }

            return {
                ...data,
                search_history: data.search_history.sort((a,b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            };

        })

};

const login = ({login_username, password}) => {

    return User.findOne({
        $or: [
            {"contact.login_username.phone": login_username},
            {"contact.login_username.email": login_username},
        ]
    }, "_id contact basic_info joined_at isVerify last_active_at dark_mode private_info search_history avatar").lean()
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
                    user: {
                        ...omit(data, "private_info"),
                        search_history: data.search_history.sort((a,b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
                    }
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
            if (!data) {
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

const resendChangePasswordToken = ({userID, registerType}) => {

    return User.findOne({_id: userID}).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("account_not_existed"));
            }

            return createNewConfirmToken({
                userID: data._id,
                registerType
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

const verifyChangePasswordToken = ({token, sessionID}) => {
    return ResetPasswordToken.findOne({
        token: token.toUpperCase(),
        _id: ObjectId(sessionID)
    }).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("wrong_token"))
            }
            return ResetPasswordToken.findOneAndUpdate({_id: ObjectId(sessionID)}, {$set: {isVerify: true}}, {new: true}).lean()
        })
};

const getChangePasswordUserBrief = sessionID => {
    console.log(sessionID)
    return ResetPasswordToken.findOne({
        _id: ObjectId(sessionID),
        isVerify: true
    }).populate("user", "private_info _id")
        .then(data => {
            console.log(data)
            if (!data) {
                return Promise.reject();
            }
            return data.toObject();
        })
};

const changePassword = ({sessionID, newPassword}) => {
    return ResetPasswordToken.findOneAndDelete({
        _id: ObjectId(sessionID)
    }).lean()
        .then(data => {
            if (!data) {
                return Promise.reject();
            }
            return User.findOneAndUpdate({_id: ObjectId(data.user)}, {$set: {"private_info.password": newPassword.trim()}})
                .then(() => null);
        })
};

const addNewSearchHistory = (userID, data) => {
    console.log(data)
    if (!data) {
        return Promise.reject(new ApplicationError());
    }
    return User.findOneAndUpdate({_id: ObjectId(userID)},
        {
            $pull: {
                search_history: {
                    content: data.content,
                    related_person: null,
                    related_group: null,
                    related_page: null
                }
            },
        })
        .then(() => User.findOneAndUpdate({_id: ObjectId(userID)},
            {
                $push: {
                    search_history: data
                }
            },
            {new: true, select: "_id search_history"}).lean())
        .then(data => {
            return {
                ...data,
                search_history: data.search_history.sort((a,b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            }
        })

};

const deleteSearchHistory = (userID, historyID) => {
    if (!historyID) {
        return Promise.reject(new ApplicationError());
    }
    return User.findOneAndUpdate({_id: ObjectId(userID)},
        {
            $pull: {
                search_history: {
                    _id: ObjectId(historyID)
                }
            }
        },
        {new: true, select: "_id search_history"}).lean()
        .then(data => {
            return {
                ...data,
                search_history: data.search_history.sort((a,b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            }
        })
};

const updateSearchHistory = (userID, historyID, data) => {
    console.log(data);
    let updatedQuery = {
        "search_history.$.search_at": Date.now()
    };
    if(data.related_person){
        updatedQuery["search_history.$.related_person"] = ObjectId(data.related_person)
    }
    else if(data.related_page){
        updatedQuery["search_history.$.related_page"] = ObjectId(data.related_page)
    }
    else if(data.related_group){
        updatedQuery["search_history.$.related_group"] = ObjectId(data.related_group)
    }
    if (!historyID) {
        return Promise.reject(new ApplicationError());
    }
    return User.findOneAndUpdate({_id: ObjectId(userID), "search_history._id": ObjectId(historyID)},
        {
            $set: updatedQuery
        },
        {new: true, select: "_id search_history"}).lean()
        .then(data => {
            return {
                ...data,
                search_history: data.search_history.sort((a,b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            }
        })

};

module.exports = {
    getAuthenticateUserInitCredentials,
    login,
    sendChangePasswordToken,
    resendChangePasswordToken,
    verifyChangePasswordToken,
    getChangePasswordUserBrief,
    changePassword,
    addNewSearchHistory,
    deleteSearchHistory,
    updateSearchHistory
};