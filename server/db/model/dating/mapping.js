const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const mappingSchema = new Schema({
    distance :{
        type: Number
    },
    gender :{
        type : Number
    },
    ageRange :{
        type : Number
    },
    heightRange :{
        type : Number
    },
    ecucationLevel : {
        type : Number
    },
    theirKids :{
        type : Number
    },
    religion : {
        type : Number
    }


})

module.exports = (db) => db.model('Mapping', mappingSchema);