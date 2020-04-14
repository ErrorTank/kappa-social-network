const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const ConfirmToken = require("../model/confirm-token")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {getUnverifiedUserRegisterType} = require("../../utils/user-utils");
const {getRandomToken} = require("../../utils/common-utils");

const createNewConfirmToken = (data) => {
    return ConfirmToken.findOneAndDelete({
        user: ObjectId(data.userID)
    })
        .then(() => new ConfirmToken({
                user: ObjectId(data.userID),
                token: getRandomToken(5),
                registerType: data.registerType
            }).save()
        )
        .then(data => data.toObject())
};


module.exports = {
    createNewConfirmToken
};