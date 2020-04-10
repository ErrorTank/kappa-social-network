const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const dayTimeAmPmSchema = require("./day-time-am-pm");

const timeRangeSchema = {
    time_range: {
        type: [
            {
                from: dayTimeAmPmSchema,
                to: dayTimeAmPmSchema
            }
        ],
        default: []
    }
};

module.exports = timeRangeSchema;