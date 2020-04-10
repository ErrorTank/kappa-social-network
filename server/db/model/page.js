const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {AddressSchema, timeRangeSchema} = require("./common-schema/common");

const pageSchema = new Schema({
    person_like_page: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    person_page_block: {
        type: [
            {
                type: ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    roles: {
        admin: {
            type: [
                {
                    type: ObjectId,
                    ref: "User"
                }
            ]
        },
        editor: {
            type: [
                {
                    type: ObjectId,
                    ref: "User"
                }
            ]
        },
        moderator: {
            type: [
                {
                    type: ObjectId,
                    ref: "User"
                }
            ]
        },
    },
    avatar: {
        type: String
    },
    chat_rooms: {
        type: [
            {
                type: ObjectId,
                ref: "ChatRoom"
            }
        ]
    },
    cover_photo: {
        type: String
    },
    basic_info: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        categories: {
            type: [
                {
                    type: ObjectId,
                    ref: "PageCategory"
                }
            ],
            default: []
        },

    },
    contact: {
        phone: {
            type: String
        },
        website: {
            type: String
        },
        email: {
            type: String
        },
    },
    location: AddressSchema,
    open_time: {
        open_type: {
            type: String,
            enum: ["SELECTED", "ALWAYS", "NONE", "PERMANENT_CLOSED"]
        },
        selected_time: {
            monday: {
                time_range: timeRangeSchema
            },
            tuesday: {
                time_range: timeRangeSchema
            },
            wednesday: {
                time_range: timeRangeSchema
            },
            thursday: {
                time_range: timeRangeSchema
            },
            friday: {
                time_range: timeRangeSchema
            },
            saturday: {
                time_range: timeRangeSchema
            },
            sunday: {
                time_range: timeRangeSchema
            },
        }
    },
    products: {
        type: [
            {
                photos: {
                    type: [
                        {
                            type: String
                        }
                    ],
                    default: []
                },
                videos: {
                    type: [
                        {
                            type: String,
                        }
                    ],
                    default: []
                },
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                },
                price: {
                    type: Number,
                    required: true
                },
                sale_price: {
                    type: Number,
                },
                is_for_sale: {
                    type: Boolean,
                    default: false
                },
                checkout_link: {
                    type: String,
                },
                condition: {
                    type: String,
                    enum: ["NEW", "REFURBISHED", "USED_FAIR", "USED_GOOD", "USED_LIKE_NEW"]
                }
            }
        ],
        default: []
    }
});


module.exports = (db) => db.model("Page", pageSchema);