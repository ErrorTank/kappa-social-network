const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {AddressSchema, timeRangeSchema} = require("./common-schema/common");
const Mixed = mongoose.Schema.Types.Mixed;

const groupSchema = new Schema({
    last_active_at: {
        type: Date,
        default: Date.now
    },
    cover_photo: {
        type: String
    },
    members: {
        type: [
            {
                related: {
                    type: ObjectId,
                    ref: "User"
                },
                joined_at: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        default: []
    },
    member_reported_posts: {
        type: [
            {
                post: {
                    type: ObjectId,
                    ref: "GroupPost"
                },
                reported_by: {
                    type: [
                        {
                            type: ObjectId,
                            ref: "User"
                        }
                    ]
                }

            }
        ],
        default: []
    } ,
    person_group_block: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    pending_posts: {
        type: [
            {
                type: ObjectId,
                ref: "GroupPost"
            }
        ],
        default: []
    },
    pending_requests: {
        type: [
            {
                related: {
                    type: ObjectId,
                    ref: "User"
                },
                answer_map: {
                    type: Mixed // Object that has key is object id, value is answer value (id or text or array of id)
                }
            }
        ],
        default: []
    },
    basic_info: {
        name: {
            type: String,
            required: true
        },
        privacy: {
            type: String,
            enum: ["PUBLIC", "PRIVATE"]
        },
        is_hidden: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
        }
    },
    member_management_setting: {
        can_approve_member_request: {
            type: String,
            enum: ["ADMIN_AND_MODERATOR", "EVERYONE"]
        }
    },
    discussion_management_setting:{
        can_post: {
            type: String,
            enum : ["ANYONE", "ADMIN_AND_MODERATOR"]
        },
        post_must_approved: {
            type: Boolean,
            default: true
        }
    },
    automatic_member_approval_setting: {
        complete_question: {
            type: Boolean,
            default: true
        },
        friend_of_member: {
            type: Boolean,
            default: true
        },
    },
    member_questions: {
        default: [],
        type: [
            {
                question_type: {
                    type: String,
                    enum: ["CHECKBOX", "MULTIPLES", "WRITTEN"]
                },
                content: {
                    type: String,
                    required: true
                },
                options: {
                    type: [
                        {
                            content: {
                                type: String,
                                required: true
                            },
                        }
                    ],
                    default: []
                }
            }
        ]
    },

});


module.exports = (db) => db.model("Group", groupSchema);