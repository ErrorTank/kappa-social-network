const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const chatBoxSchema = new Schema({
  user1 : {
    type: ObjectId,
    ref:"Profile"
  },
  user2 : {
    type: ObjectId,
    ref:"Profile"
  },
  messages : {
    type : [
      {message : String, user : {
        type: ObjectId,
        ref:"Profile"
      },}
    ],
    default : []
  }
})

module.exports = (db) => db.model('ChatBox', chatBoxSchema);