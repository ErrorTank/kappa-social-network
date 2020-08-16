const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const editorContentSchema = require("./editor-content");
const {ReactionSchema} = require("./reactions");

const postSchema = {
    policy: {
        type: String,
        enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
        default: "PUBLIC"
    },
    belonged_page: {
        type: ObjectId,
        ref: "Page"
    },
    is_pinned: {
        type: Boolean,
        default: false
    },
    is_approved: {
        type: Boolean,
        default: false
    },
    belonged_group: {
        type: ObjectId,
        ref: "Group"
    },
    belonged_person: {
        type: ObjectId,
        ref: "User"
    },
    tagged: {
        default: [],
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ]
    },
    block_share: {
        type: Boolean,
        default: false
    },
    reactions: ReactionSchema,

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
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
                caption: String,
                tagged: {
                    default: [],
                    type: [
                        {
                            related: {
                                type: ObjectId,
                                ref: "User"
                            },
                            ratioX: {
                                type: Number
                            },
                            ratioY: {
                                type: Number
                            },
                            boxWidthRatio: {
                                type: Number
                            },
                            boxHeightRatio: {
                                type: Number
                            }
                        }
                    ]
                },
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
    ...editorContentSchema,
    shared_page_post: {
        type: ObjectId,
        ref: "PagePost"
    },
    shared_group_post: {
        type: ObjectId,
        ref: "GroupPost"
    },
    shared_person_post: {
        type: ObjectId,
        ref: "PersonPost"
    },
    comment_disabled: {
        type: Boolean,
        default: false
    },
    shared_page: {
        type: ObjectId,
        ref: "Page"
    },
    comments: {
        default: [],
        type: [
            {
                type: ObjectId,
                ref: "Comment"
            }
        ]
    }
};

module.exports = postSchema;