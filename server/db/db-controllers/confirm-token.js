const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const ConfirmToken = require("../model/confirm-token")(appDb);
const ResetPasswordToken = require("../model/reset-password-token")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {getUnverifiedUserRegisterType} = require("../../utils/user-utils");
const {getRandomToken} = require("../../utils/common-utils");

const createNewConfirmToken = (data, type = "account") => {
    let removeQuery = {
        user: ObjectId(data.userID)
    };
    let insertParams = {
        user: ObjectId(data.userID),
        token: getRandomToken(3).toUpperCase(),
        register_type: data.registerType
    };
    return (type === "account" ? ConfirmToken.findOneAndDelete(removeQuery) : ResetPasswordToken.findOneAndDelete(removeQuery))
        .then(() => (type === "account" ? new ConfirmToken(insertParams).save() : new ResetPasswordToken(insertParams).save())
        )
        .then(data => data.toObject())
};


module.exports = {
    createNewConfirmToken,
};