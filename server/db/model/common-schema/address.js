const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const addressSchema = {
    city: {
        type: ObjectId,
        ref: "City"
    },
    district: {
        type: ObjectId,
        ref: "District"
    },
    ward: {
        type: ObjectId,
        ref: "Ward"
    },
    sub: String
};

module.exports = addressSchema;