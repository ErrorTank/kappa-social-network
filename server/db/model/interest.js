const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const interestSchema = new Schema({
    interestedKey: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

});


module.exports = (db) => db.model("Interest", interestSchema);