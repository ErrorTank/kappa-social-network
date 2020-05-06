const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {editorContentSchema} = require("./common-schema/common");

const chatRoomSchema = new Schema({
   last_updated: {
      type: Date,
      default: Date.now
   },
   last_active: {
      type: Date,
      default: Date.now
   },
   involve_person: {
      default: [],
      type: [
         {
            related: {
               type: ObjectId,
               ref: "User"
            },
            nickname: {
               type: String
            }
         }
      ]
   },
   default_emoji: {
       type: String
   },
   involve_page: {
      default: [],
      type: [
         {
            related: {
               type: ObjectId,
               ref: "Page"
            },
            nickname: {
               type: String
            }
         }
      ]
   },
   admins: {
      type: [
         {
            type: ObjectId,
            ref:"User"
         }
      ],
      default: []
   },
   group_name: {
      type: String,
   },
   context: {
      default: [],
      type: [
         {
            seenBy: {
               default: [],
               type: [
                  {
                     type: ObjectId,
                     ref: "User"
                  }
               ]
            },
            state: {
               type: String,
               enum: ["NOT_SENT", "CACHED", "SENT"]
            },
            content: {
               type: String,
               required: true
            },
            created_at: {
               type: Date,
               default: Date.now
            },
            ...editorContentSchema,

         }
      ]
   }

});


module.exports = (db) => db.model("ChatRoom", chatRoomSchema);