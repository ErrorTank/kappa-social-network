const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  bio: {
    type: String,
  },
  name: {
    type: String,
    require : true
  },
  avatar : [{url : String, order : avatar.length +1}],
  birthday : {
      type: Date,
      require :true
  },
  location : {
      lat : Number,
      lng : Number,
      ward : {type:ObjectId, ref:"Ward"},
      district :{type:ObjectId, ref:"District"},
      city : {type:ObjectId, ref="City"},

  },
  gender :{
      type : String,
      enum :["MALE","FEMALE", "OTHERS"]
  },
  target : {
      type: String,
      enum : ["CHATTING", "FRIENDSHIP","SOMETHING CASUAL", "LONG-TERM RELATIONSHIP","PREFER NOT TO SAY"]
  },
  height : {
    type : Number

  },
  homeTown :{
    ward : {type:ObjectId, ref:"Ward"},
    district :{type:ObjectId, ref:"District"},
    city : {type:ObjectId, ref="City"},
  },
  job : {
    type : String
  },
  company :{
    type : String
  },
  secondarySchool :{
    type : String
  },
  university :{
    type : String
  },
  universityPostgraduate :{
    type : String
  },
  educationLevel : {
    type : String,
    enum :["A-LEVELS,HIGHERS OR EQUIVALENT", "BACHELORS DEGREE", "UNIVERSITY(POSTGRADUATE) DEGREE", 'PREFER NOT TO SAY']
  },
  yourChildren : {
    type: String,
    enum : ["I DON'T HAVE KIDS",'I HAVE KIDS', "PREFER NOT TO SAY"]
  },
  smoking : {
    type :String,
    enum : ["NEVER", "OCCASIONALLY","OFTEN","FREFER NOT TO SAY"]
  },
  drinking : {
    type : String,
    enum : ["NEVER", "OCCASIONALLY","OFTEN","FREFER NOT TO SAY"]
  }
  

 
});

module.exports = (db) => db.model('Profile', profileSchema);
