const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const editorContentSchema = require("./common-schema/editor-content");
const {ReactionSchema} = require("./common-schema/reactions");

const commentSchema =  new Schema({
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
    replies: {
        type: [{
            type: ObjectId,
            ref: "Comment"
        }],
        default: []
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
    post: {
        type: ObjectId,
        ref: "POST"
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
    },
    is_reply: {
        type: Boolean,
        default: false
    }
});
const autoPopulateParent = function(next){
    this.populate([
        {
            path: "from_person",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        }, {
            path: "mentions.related",
            model: "User",
            select: "_id basic_info avatar last_active_at active"

        }, {
            path: "from_page",
            model: "Page",
            select: "_id basic_info avatar"
        },{
            path: "mentioned_page",
            model: "User",
            select: "_id basic_info avatar"
        },
    ]);
    next();
};
commentSchema.pre("find", autoPopulateParent).pre("findOne", autoPopulateParent).pre("findOneAndUpdate", autoPopulateParent);
commentSchema.post('save', function(doc, next) {
    doc.populate([
        {
            path: "from_person",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        }, {
            path: "mentions.related",
            model: "User",
            select: "_id basic_info avatar last_active_at active"

        }, {
            path: "from_page",
            model: "Page",
            select: "_id basic_info avatar"
        },{
            path: "mentioned_page",
            model: "User",
            select: "_id basic_info avatar"
        },
    ]).execPopulate().then(function() {
        next();
    });
} );


module.exports = (db) => db.model("Comment", commentSchema);