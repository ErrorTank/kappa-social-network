const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {postSchema} = require("./common-schema/common");

const groupPostSchema = new Schema({
    ...postSchema,
    created_by: {
        type: ObjectId,
        ref: "User"
    },
    belonged_group: {
        type: ObjectId,
        ref: "Group"
    },
    is_pinned: {
        type: Boolean,
        default: false
    },
    is_approved: {
        type: Boolean,
        default: false
    },

});


module.exports = (db) => db.model("GroupPost", groupPostSchema);