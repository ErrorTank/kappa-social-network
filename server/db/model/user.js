const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {AddressSchema} = require("./common-schema/common");

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
    saved_person_posts: {
        type: [
            {
                type: ObjectId,
                ref: "PersonPost"
            }
        ],
        default: []
    },
    saved_group_posts: {
        type: [
            {
                type: ObjectId,
                ref: "GroupPost"
            }
        ],
        default: []
    },
    saved_page_posts: {
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
                notification_type: {
                    enum: [
                        "POST_ON_YOUR_WALL", "YOU_BEEN_TAGGED", "YOU_BEEN_MENTIONED_IN_POST", "YOU_BEEN_MENTIONED_IN_COMMENT", "YOU_BEEN_FOLLOWED", "YOUR_COMMENT_BEEN_REACTED", "YOUR_COMMENT_BEEN_LIKED",
                        "YOUR_COMMENT_BEEN_REPLIED", "YOUR_POST_BEEN_LIKED", "YOUR_POST_BEEN_REACTED", "YOUR_POST_BEEN_COMMENTED", "FRIEND_REQUEST_ACCEPTED", "YOUR_BIRTHDAY", "FRIENDS_BIRTHDAY",
                        "YOUR_PAGE_BEEN_LIKED", "YOUR_PAGE_HAS_MESSAGE", "YOUR_PAGE_BEEN_UPDATED", "YOUR_GROUP_BEEN_UPDATED", "INVITE_YOU_TO_PAGE", "INVITE_YOU_TO_GROUP", "LIKED_PAGE_POST", "FOLLOWED_PERSON_POST",
                        "JOINED_GROUP_HAS_NEW_POST", "YOUR_GROUP_HAS_NEW_POST"
                    ]

                },
                belonged_group: {
                    type: ObjectId,
                    ref: "Group"
                },
                belonged_page: {
                    type: ObjectId,
                    ref: "Page"
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


            }

        ]
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