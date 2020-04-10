const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const postSchema = {
    policy: {
        type: String,
        enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
        default: "PUBLIC"
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
    mentioned_person: {
        default: [],
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ]
    },
    content: {
        type: String,
        required: true
    },
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
    shared_page: {
        type: ObjectId,
        ref: "Page"
    },
    comments: {
        default: [],
        type: [
            {
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
            }
        ]
    }
};

module.exports = postSchema;