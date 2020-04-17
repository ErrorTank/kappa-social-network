const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema =  new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    created_at: { type: Date, expires: '30m', default: Date.now },
    register_type: {
        type: String,
        enum: ["PHONE", "EMAIL"]
    },
    isVerify: {
        type: Boolean,
        required: true,
        default: false
    }
});



module.exports = (db) => db.model("ResetPasswordToken", tokenSchema);