const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const chatBoxSchema = new Schema({
  user1: {
    type: ObjectId,
    ref: "Profile",
  },
  user2: {
    type: ObjectId,
    ref: "Profile",
  },
  messages: {
    type: [
      {
        createdAt: {
          type: Date,
          default: Date.now,
        },
        message: String,
        user: {
          type: ObjectId,
          ref: "Profile",
        },
      },
    ],
    default: [],
  },
});
const autoPopulateParent = function (next) {
  this.populate([
    {
      path: "user1",
      model: "Profile",
    },
    {
      path: "user2",
      model: "Profile",
    },
    {
      path: "messages.user",
      model: "Profile",
    },
  ]);
  next();
};
chatBoxSchema
  .pre("find", autoPopulateParent)
  .pre("findOne", autoPopulateParent)
  .pre("findOneAndUpdate", autoPopulateParent);
chatBoxSchema.post("save", function (doc, next) {
  doc
    .populate([
      {
        path: "user1",
        model: "Profile",
      },
      {
        path: "user2",
        model: "Profile",
      },
      {
        path: "messages.user",
        model: "Profile",
      },
    ])
    .execPopulate()
    .then(function () {
      next();
    });
});
module.exports = (db) => db.model("ChatBox", chatBoxSchema);
