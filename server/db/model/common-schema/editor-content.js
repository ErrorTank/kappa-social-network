const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const editorContentSchema = {
    content: {
        type: String,
        required: true
    },
    photos: {
        default: [],
        type: [
            {
                type: String,
            }
        ]
    },
    files: {
        default: [],
        type: [
            {
                type: String,
            }
        ]
    },
    videos: {
        default: [],
        type: [
            {
                type: String,
            }
        ]
    },
    hyperlinks: {
        default: [],
        type: [
            {
                type: String,
            }
        ]
    }
};

module.exports = editorContentSchema;