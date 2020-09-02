const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const chatBoxSchema = new Schema({
  user1 : ObjectId,
  user2 : ObjectId,
  messages : {
    type : [
      {message : String, user : ObjectId}
    ],
    default : []
  }
})

module.exports = (db) => db.model('ChatBox', chatBoxSchema);