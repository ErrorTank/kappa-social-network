const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const pageCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    required_pre_fill: {
        type: Boolean,
        default: false
    },
    page_has_location: {
        type: Boolean,
        default: false
    },
    page_has_open_time: {
        type: Boolean,
        default: false
    },
    page_has_sell_items: {
        type: Boolean,
        default: false
    },
});


module.exports = (db) => db.model("PageCategory", pageCategorySchema);