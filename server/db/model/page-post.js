const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {postSchema} = require("./common-schema/common");

const groupPostSchema = new Schema({
    ...postSchema,
    belonged_page: {
        type: ObjectId,
        ref: "Page"
    },
    is_pinned: {
        type: Boolean,
        default: false
    }

});


module.exports = (db) => db.model("GroupPost", groupPostSchema);