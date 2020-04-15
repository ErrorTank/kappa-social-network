const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema =  new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  created_at: { type: Date, expires: '20s', default: Date.now },
  register_type: {
    type: String,
    enum: ["PHONE", "EMAIL"]
  }
});



module.exports = (db) => db.model("TokenConfirmation", tokenSchema);