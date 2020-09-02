const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  user1 : ObjectId,
  user2 : ObjectId

})

module.exports = (db) => db.model('Match', matchSchema);