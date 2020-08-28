const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const editorContentSchema = require("./common-schema/editor-content");
const {ReactionSchema} = require("./common-schema/reactions");

const postSchema = new Schema({
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
    share_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
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
    ...editorContentSchema,
    shared_post: {
        type: ObjectId,
        ref: "Post"
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
                ...editorContentSchema,
                reactions: ReactionSchema,
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
                        }
                    ]
                },
                created_at: {
                    type: Date,
                    default: Date.now
                },
                updated_at: {
                    type: Date,
                    default: Date.now
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
});
const autoPopulateParent = function(next){
    this.populate([
        {
            path: "belonged_person",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        }, {
            path: "tagged",
            model: "User",
            select: "_id basic_info avatar last_active_at active"

        }, {
            path: "mentions.related",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        },{
            path: "shared_page",
            model: "Page",
        },{
            path: "files.tagged.related",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        }
    ]);
    next();
};
postSchema.pre("find", autoPopulateParent).pre("findOne", autoPopulateParent).pre("findOneAndUpdate", autoPopulateParent);
postSchema.post('save', function(doc, next) {
    doc.populate([
        {
            path: "belonged_person",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        }, {
            path: "tagged",
            model: "User",
            select: "_id basic_info avatar last_active_at active"

        }, {
            path: "mentions.related",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        },{
            path: "files.tagged.related",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        },{
            path: "shared_page",
            model: "Page",
        },
    ]).execPopulate().then(function() {
        next();
    });
} );

module.exports = (db) => db.model("Post", postSchema);