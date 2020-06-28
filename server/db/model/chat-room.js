const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {editorContentSchema} = require("./common-schema/common");

const chatRoomSchema = new Schema({
    last_updated: {
        type: Date,
        default: Date.now
    },
    last_active: {
        type: Date,
        default: Date.now
    },
    is_group_chat: {
        type: Boolean,
        default: false
    },
    involve_person: {
        default: [],
        type: [
            {
                related: {
                    type: ObjectId,
                    ref: "User"
                },
                nickname: {
                    type: String
                }
            }
        ]
    },
    default_emoji: {
        type: String
    },
    involve_page: {
        default: [],
        type: [
            {
                related: {
                    type: ObjectId,
                    ref: "Page"
                },
                nickname: {
                    type: String
                }
            }
        ]
    },
    admins: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    group_name: {
        type: String,
        default: ""
    },
    context: {
        default: [],
        type: [

            {
                is_init: {
                    type: Boolean,
                    default: false
                },
                sentBy: {
                    type: ObjectId,
                    ref: "User"
                },
                seenBy: {
                    default: [],
                    type: [
                        {
                            type: ObjectId,
                            ref: "User"
                        }
                    ]
                },
                replyFor: {
                    type: ObjectId,
                    default: null
                },
                state: {
                    type: String,
                    enum: ["CACHED", "SAVED", "SENT"]
                },
                created_at: {
                    type: Date,
                    default: Date.now
                },
                file: {
                    path: String,
                    name: String,
                    origin_path: String
                },
                ...editorContentSchema,

            }
        ]
    }

});


module.exports = (db) => db.model("ChatRoom", chatRoomSchema);