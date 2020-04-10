const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const pageSchema = new Schema({
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
    }
});


module.exports = (db) => db.model("Page", pageSchema);