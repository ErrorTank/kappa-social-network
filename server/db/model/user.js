const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    last_active_at: {
        type: Date,
        default: Date.now
    },
    joined_at: {
        type: Date,
        default: Date.now
    },
    dark_mode: {
        type: Boolean,
        default: false
    },
    chat_rooms: {
        type: [
            {
                type: ObjectId,
                ref: "ChatRoom"
            }
        ],
        default: []
    },
    liked_pages: {
        type: [
            {
                type: ObjectId,
                ref: "Page"
            }
        ],
        default: []
    },
    joined_groups: {
        type: [
            {
                type: ObjectId,
                ref: "Group"
            }
        ],
        default: []
    },
    blocked_person_posts: {
        type: [
            {
                type: ObjectId,
                ref: "PersonPost"
            }
        ],
        default: []
    },
    blocked_group_posts: {
        type: [
            {
                type: ObjectId,
                ref: "GroupPost"
            }
        ],
        default: []
    },
    blocked_page_posts: {
        type: [
            {
                type: ObjectId,
                ref: "PagePost"
            }
        ],
        default: []
    },
    followed_person_posts: {
        type: [
            {
                type: ObjectId,
                ref: "PersonPost"
            }
        ],
        default: []
    },
    followed_group_posts: {
        type: [
            {
                type: ObjectId,
                ref: "GroupPost"
            }
        ],
        default: []
    },
    followed_page_posts: {
        type: [
            {
                type: ObjectId,
                ref: "PagePost"
            }
        ],
        default: []
    },
    notifications: {
        type: [
            {
                notification_type: {
                    enum: ["POST_ON_YOUR_WALL", "YOU_BEEN_TAGGED", "YOU_BEEN_MENTIONED_IN_POST", "YOU_BEEN_MENTIONED_IN_COMMENT", "YOU_BEEN_FOLLOWED", "YOUR_COMMENT_BEEN_REACTED", "YOUR_COMMENT_BEEN_LIKED",
                        "YOUR_COMMENT_BEEN_REPLIED", "YOUR_POST_BEEN_LIKED", "YOUR_POST_BEEN_REACTED", "YOUR_POST_BEEN_COMMENTED", "FRIEND_REQUEST_ACCEPTED", "YOUR_BIRTHDAY", "FRIENDS_BIRTHDAY",
                        "YOUR_PAGE_BEEN_LIKED", "YOUR_PAGE_HAS_MESSAGE", "YOUR_PAGE_BEEN_UPDATED", "YOUR_GROUP_BEEN_UPDATED", "INVITE_YOU_TO_PAGE", "INVITE_YOU_TO_GROUP", "LIKED_PAGE_POST", "FOLLOWED_PERSON_POST",
                        "JOINED_GROUP_HAS_NEW_POST"
                    ]

                },
                published_time: {
                    type: Date,
                    default: Date.now
                },
                same_count: {
                    type: Number,
                    default: 0
                },
                person: {
                    type: ObjectId,
                    ref: "User"
                },
                person_post: {
                    type: ObjectId,
                    ref: "PersonPost"
                },
                page_post: {
                    type: ObjectId,
                    ref: "PagePost"
                },
                group_post: {
                    type: ObjectId,
                    ref: "GroupPost"
                },
                page: {
                    type: ObjectId,
                    ref: "Page"
                },
                group: {
                    type: ObjectId,
                    ref: "Group"
                },
                comment: {
                    type: ObjectId
                }
            }
        ]
    },
    avatar: {
        type: String,
    },
    person_blocked: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    page_blocked: {
        type: [
            {
                type: ObjectId,
                ref: "Page"
            }
        ],
        default: []
    },
    person_follow_you: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    person_you_follow: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    friends: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ]
    },
    friend_requests: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ]
    },
    new_feed_filters: {
        pages: {
            type: [
                {
                    type: ObjectId,
                    ref: "Group"
                }
            ]
        },
        friends: {
            type: [
                {
                    type: ObjectId,
                    ref: "User"
                }
            ]
        }
    },
    mute_chat_rooms: {
        type: [
            {
                type: ObjectId,
                ref: "ChatRoom"
            }
        ]
    },
    bio: {
        type: String,
        default: ""
    },
    interested: {
        type: [
            {
                type: ObjectId,
                ref: "Interest"
            }
        ],
        default: []
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
});


module.exports = (db) => db.model("User", userSchema);