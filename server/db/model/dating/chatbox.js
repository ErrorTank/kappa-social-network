const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const chatBoxSchema = new Schema({
  user1 : ObjectId,
  user2 : ObjectId,
  messages : [
      {message : String, user : ObjectId}
  ]

})

module.exports = (db) => db.model('Chatbox', chatboxSchema);