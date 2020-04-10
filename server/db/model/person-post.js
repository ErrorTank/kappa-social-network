const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {postSchema} = require("./common-schema/common");

const personPostSchema = new Schema({
    ...postSchema,
    created_by: {
        type: ObjectId,
        ref: "User"
    },
    belonged_person: {
        type: ObjectId,
        ref: "User"
    }

});


module.exports = (db) => db.model("PersonPost", personPostSchema);