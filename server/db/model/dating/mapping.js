const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const mappingSchema = new Schema({
    distance :{
        type: Number,
        default: 2
    },
    gender :{
        type : Number,
        default: 2
    },
    ageRange :{
        type : Number,
        default: 2
    },
    heightRange :{
        type : Number,
        default: 2
    },
    educationLevel : {
        type : Number,
        default: 2
    },
    theirKids :{
        type : Number,
        default: 2
    },
    religion : {
        type : Number,
        default: 2
    }


})

module.exports = (db) => db.model('Mapping', mappingSchema);