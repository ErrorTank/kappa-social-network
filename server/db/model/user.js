const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {AddressSchema} = require("./common-schema/common");

const privacySchema = {
    type: String,
    enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
    default: "PUBLIC"
};

const userSchema = new Schema({
    active: {
        type: Boolean,
        default: false
    },
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
    search_history: {
        type: [
            {
                related_group: {
                    type: ObjectId,
                    ref: "Group"
                },
                related_page: {
                    type: ObjectId,
                    ref: "Group"
                },
                related_person: {
                    type: ObjectId,
                    ref: "Group"
                },
                content: String,
                search_at: {
                    type: Date,
                    default: Date.now
                }
            },
        ],
        default: []
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
    blocked_posts: {
        type: [
            {
                type: ObjectId,
                ref: "Post"
            }
        ],
        default: []
    },

    saved_posts: {
        type: [
            {
                type: ObjectId,
                ref: "Post"
            }
        ],
        default: []
    },


    followed_posts: {
        type: [
            {
                post: {
                    type: ObjectId,
                    ref: "Post"

                },
                followed_at: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        default: []
    },
    notification_settings: {
        friend_request: {
            type: Boolean,
            default: true
        },
        followed_friend_post: {
            type: Boolean,
            default: true
        },
        post_comment_been_reacted: {
            type: Boolean,
            default: true
        },
        post_comment_been_replied: {
            type: Boolean,
            default: true
        },
        tagged_in: {
            type: Boolean,
            default: true
        },
        blocked_notification_groups: {
            type: [
                {
                    type: ObjectId,
                    ref: "Group"
                }
            ],
            default: []
        },
        blocked_notification_pages: {
            type: [
                {
                    type: ObjectId,
                    ref: "Group"
                }
            ],
            default: []
        },
    },
    notifications: {

        type: [
            {
                is_seen: {
                    type: Boolean,
                    default: false
                },
                notification_type: {
                    type: String,
                    enum: [
                       "comment_on_followed_post", "mentioned_in_comment", "reply_on_comment", "mentioned_in_reply", "react_comment",
                        "react_post", "tagged_on_post", "tagged_on_post_file", "friend_request", "post_on_wall"
                    ]

                },
                reacted_by: {
                    type: ObjectId,
                    ref: "User"
                },
                reaction: {
                    type: Number
                },
                comment: {
                    type: ObjectId,
                    ref: "Comment"
                },
                file: {
                    rootFileID: {
                        type: ObjectId
                    },
                    caption: String,
                    origin_path: String,
                    path: String,
                    name: String
                },
                reply: {
                    type: ObjectId,
                    ref: "Comment"
                },
                published_time: {
                    type: Date,
                    default: Date.now
                },
                person: {
                    type: ObjectId,
                    ref: "User"
                },
                post: {
                    type: ObjectId,
                    ref: "Post"
                },
                page: {
                    type: ObjectId,
                    ref: "Page"
                },
                group: {
                    type: ObjectId,
                    ref: "Group"
                },
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
    group_blocked: {
        type: [
            {
                type: ObjectId,
                ref: "Group"
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

    friends: {
        type: [
            {
                info: {
                    type: ObjectId,
                    ref: "User"
                },
                last_interact: {
                    type: Date,
                    default: Date.now
                }
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
    current_chat_box: {
        type: ObjectId,
        ref: "User"
    },
    bubble_list: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
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
    general_settings: {
        block_friend_request: {
            type: Boolean,
            default: false
        }
    },
    security_settings: {
        login_sessions: {
            type: [
                {
                    name: String,
                    location: {
                        lat: String,
                        lng: String
                    },
                    last_sign_out: Date,
                    browser: String
                }
            ]
        }
    },
    cover_photo: String,
    private_info: {
        password: {
            type: String,
            required: true
        },
    },
    privacy_setting: {
        can_see_photos: {
            type: String,
            enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
            default: "FRIENDS"
        },
        can_see_videos: {
            type: String,
            enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
            default: "FRIENDS"
        },
        can_see_friends: {
            type: String,
            enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
            default: "PUBLIC"
        },
        can_see_wall: {
            type: String,
            enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
            default: "FRIENDS"
        },
        can_see_profile: {
            type: String,
            enum: ["PERSONAL", "FRIENDS", "PUBLIC"],
            default: "PUBLIC"
        },
    },
    basic_info: {
        username: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHERS"],
            required: true
        },
        dob: {
            type: Date,
        },
        last_updated: {
            type: Date,
            default: Date.now
        },
        profile_link: String
    },
    isVerify: {type: Boolean, default: false, required: true},
    contact: {
        address: AddressSchema,
        login_username: {
            type: {
                phone: String,
                email: String
            },
            required: true
        },
        last_updated: {
            type: Date,
            default: Date.now
        },
    },
    relationship: {
        status: ["SINGLE", "IN_RELATIONSHIP", "COMPLICATED"],
        related_person: {
            type: ObjectId,
            ref: "User"
        },
        last_updated: {
            type: Date,
            default: Date.now
        },
    },
    works: {
        type: [
            {
                company: {
                    related: {
                        type: ObjectId,
                        ref: "Page"
                    },
                    text: String
                },
                position: String,
                currently_working: {
                    type: Boolean,
                    default: true
                },
                last_updated: {
                    type: Date,
                    default: Date.now
                },
                privacy: privacySchema

            }

        ]
    },
    schools: {
        type: [
            {
                school: {
                    related: {
                        type: ObjectId,
                        ref: "Page"
                    },
                    text: String
                },
                graduated: {
                    type: Boolean,
                    default: true
                },
                last_updated: {
                    type: Date,
                    default: Date.now
                },
                privacy: privacySchema

            },

        ]
    },
    favorites: {
        type: [{
            type: String
        }],
        default: []
    },
    user_about_privacy: {
        basic_info: {
            gender: privacySchema,
            dob: privacySchema,
        },
        contact: {
            address: privacySchema,
            home_town: privacySchema,
            login_username: {
                phone: privacySchema,
                email: privacySchema
            },
        },

    },
    chat_settings: {
        turn_off_active: {
            all_contacts: {
                type: Boolean,
                default: false
            },
            all_contacts_but: {
                type: [
                    {
                        type: ObjectId,
                        ref: "User"
                    }
                ],
                default: []
            },
            specific_contacts: {
                type: [
                    {
                        type: ObjectId,
                        ref: "User"
                    }
                ],
                default: []
            }
        },

    }
});


module.exports = (db) => db.model("User", userSchema);