const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const editorContentSchema = require("./common-schema/editor-content");
const {ReactionSchema} = require("./common-schema/reactions");

const commentSchema = new Schema({
    ...editorContentSchema,
    reactions: ReactionSchema,
    mentioned_page: {
        default: [],
        type: [
            {
                type: ObjectId,
                ref: "Page"
            }
        ]
    },
    files: {
        default: [],
        type: [
            {
                path: String,
                name: String,
                origin_path: String,
            }
        ]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
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