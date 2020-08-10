const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const editorContentSchema = require("./common-schema/editor-content");

const commentSchema = new Schema({
    ...editorContentSchema,
    mentioned_page: {
        default: [],
        type: [
            {
                type: ObjectId,
                ref: "Page"
            }
        ]
    },
    mentioned_person: {
        default: [],
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ]
    },
    from_page: {
        type: ObjectId,
        ref: "Page"
    },
    from_person: {
        type: ObjectId,
        ref: "User"
    }

});


module.exports = (db) => db.model("PersonPost", commentSchema);