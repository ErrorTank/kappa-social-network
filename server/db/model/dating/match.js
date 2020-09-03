const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  user1 : {
    type: ObjectId,
    ref:"Profile"
  },
  user2 : {
    type: ObjectId,
    ref:"Profile"
  },

})

module.exports = (db) => db.model('Match', matchSchema);