const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const dayTimeAMPMSchema = {
    hour: {
        type: Number,
        min: 1,
        max: 12
    },
    minute: {
        type: Number,
        min: 0,
        max: 59
    },
    type: {
        type: String,
        enum: ["AM", "PM"]
    }
};

module.exports = dayTimeAMPMSchema;