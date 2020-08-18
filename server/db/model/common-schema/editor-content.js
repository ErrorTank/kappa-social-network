const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const editorContentSchema = {
    content: {
        type: String,

    },

    mentions: {
        default: [],
        type: [
            {
                related: {
                    type: ObjectId,
                    ref: "User"
                },
                name: String
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