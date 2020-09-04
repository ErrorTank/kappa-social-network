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
  avatar : {
     type : [
      { url : String, 
        order : Number
      }],
      default: []
  },
  birthday : {
      type: Date,
      require :true
  },
  location : {
      lat : Number,
      lng : Number,
      ward : {type:ObjectId, ref:"Ward"},
      district :{type:ObjectId, ref:"District"},
      city : {type:ObjectId, ref :"City"},

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
    city : {type:ObjectId, ref: "City"},
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
    enum :["A-LEVELS,HIGHERS OR EQUIVALENT", "BACHELORS DEGREE", "UNIVERSITY(POSTGRADUATE) DEGREE", 'PREFER NOT TO SAY'],
    default : "PREFER NOT TO SAY"
  },
  yourChildren : {
    type: String,
    enum : ["I DON'T HAVE KIDS",'I HAVE KIDS', "PREFER NOT TO SAY"],
    default : "PREFER NOT TO SAY"
  },
  smoking : {
    type :String,
    enum : ["NEVER", "OCCASIONALLY","OFTEN","FREFER NOT TO SAY"],
    default : "PREFER NOT TO SAY"
  },
  drinking : {
    type : String,
    enum : ["NEVER", "OCCASIONALLY","OFTEN","FREFER NOT TO SAY"],
    default : "PREFER NOT TO SAY"
  },
  religion : {
    type : String,
    enum : ["PREFER NOT TO SAY", "AGNOSTIC", "ATHEIST", "BUDDHIST", "CATHOLIC", "CHRISTIAN", "HINDU", "JEWISH", "MUSLIM", "SIKH", "SPIRITUAL", "OTHER"],
    default : "PREFER NOT TO SAY"
  },
  popularity : {
    Type : Number
  },
  filterSetting : {
    distance : Number,
    gender : {
      type : String,
      enum : ["MALE", "FEMALE", "OTHERS"]
    },
    ageRange : {
      fromNumber : Number,
      toNumber : Number
    },
    heightRange : {
      fromNumber : Number,
      toNumber : Number
    },
    educationLevel : {
      type : String,
      enum : [" NO PREFERENCE", "A-LEVELS,HIGHERS OR EQUIVALENT", "BACHELORS DEGREE", "UNIVERSITY(POSTGRADUATE) DEGREE"],
      default : "NO PREFERENCE"
    },
    theirKids : {
      type : String,
      enum: ["NO PREFERENCE","THEY HAVE KIDS", "THEY DON'T HAVE KIDS"],
      default : "NO PREFERENCE"
    },
    religion : {
      type : String,
      enum : ["NO PREFERENCE", "AGNOSTIC", "ATHEIST", "BUDDHIST", "CATHOLIC", "CHRISTIAN", "HINDU", "JEWISH", "MUSLIM", "SIKH", "SPIRITUAL", "OTHER"],
      default : "NO PREFERENCE"
    }
    },
    seen : { 
      type : [
        { url :ObjectId, 
          action : {
            type : String,
            enum : ["LIKE", "DISLIKE"]
        },
        time : Date
    }
    ],
    default : []
  }
  ,
  root_user: {
    type: ObjectId,
    ref:"User"
  }
 
});

module.exports = (db) => db.model('Profile', profileSchema);
