const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const pageTypeSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },

});


module.exports = (db) => db.model("PageType", pageTypeSchema);