const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  bio: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    require: true,
  },
  avatars: {
    type: [{ path: String, isAvatar: { type: Boolean, default: false } }],
    default: [],
  },
  birthday: {
    type: Date,
    require: true,
  },
  locationCoordinate: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  location: {
    lat: Number,
    lng: Number,
    ward: { type: ObjectId, ref: "Ward" },
    district: { type: ObjectId, ref: "District" },
    city: { type: ObjectId, ref: "City" },
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHERS"],
  },
  target: {
    type: String,
    enum: [
      "CHATTING",
      "FRIENDSHIP",
      "SOMETHING CASUAL",
      "LONG-TERM RELATIONSHIP",
      "PREFER NOT TO SAY",
    ],
    default: "PREFER NOT TO SAY",
  },
  height: {
    type: Number,
  },
  homeTown: {
    ward: { type: ObjectId, ref: "Ward" },
    district: { type: ObjectId, ref: "District" },
    city: { type: ObjectId, ref: "City" },
  },
  job: {
    type: String,
  },
  company: {
    type: String,
  },
  secondarySchool: {
    type: String,
  },
  university: {
    type: String,
  },
  universityPostgraduate: {
    type: String,
  },
  educationLevel: {
    type: String,
    enum: [
      "A-LEVELS,HIGHERS OR EQUIVALENT",
      "BACHELORS DEGREE",
      "UNIVERSITY(POSTGRADUATE) DEGREE",
      "PREFER NOT TO SAY",
    ],
    default: "PREFER NOT TO SAY",
  },
  yourKids: {
    type: String,
    enum: ["I DON'T HAVE KIDS", "I HAVE KIDS", "PREFER NOT TO SAY"],
    default: "PREFER NOT TO SAY",
  },
  smoking: {
    type: String,
    enum: ["NEVER", "OCCASIONALLY", "OFTEN", "PREFER NOT TO SAY"],
    default: "PREFER NOT TO SAY",
  },
  drinking: {
    type: String,
    enum: ["NEVER", "OCCASIONALLY", "OFTEN", "PREFER NOT TO SAY"],
    default: "PREFER NOT TO SAY",
  },
  religion: {
    type: String,
    enum: [
      "PREFER NOT TO SAY",
      "AGNOSTIC",
      "ATHEIST",
      "BUDDHIST",
      "CATHOLIC",
      "CHRISTIAN",
      "HINDU",
      "JEWISH",
      "MUSLIM",
      "SIKH",
      "SPIRITUAL",
      "OTHER",
    ],
    default: "PREFER NOT TO SAY",
  },
  popularity: {
    Type: Number,
  },
  filterSetting: {
    distance: {
      type: Number,
      default: 100,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHERS"],
    },
    ageRange: {
      fromNumber: {
        type: Number,
        default: 18,
      },
      toNumber: { type: Number, default: 30 },
    },
    heightRange: {
      fromNumber: {
        type: Number,
        default: 140,
      },
      toNumber: { type: Number, default: 200 },
    },
    educationLevel: {
      type: String,
      enum: [
        "NO PREFERENCE",
        "A-LEVELS,HIGHERS OR EQUIVALENT",
        "BACHELORS DEGREE",
        "UNIVERSITY(POSTGRADUATE) DEGREE",
      ],
      default: "NO PREFERENCE",
    },
    theirKids: {
      type: String,
      enum: ["NO PREFERENCE", "THEY HAVE KIDS", "THEY DON'T HAVE KIDS"],
      default: "NO PREFERENCE",
    },
    religion: {
      type: String,
      enum: [
        "NO PREFERENCE",
        "AGNOSTIC",
        "ATHEIST",
        "BUDDHIST",
        "CATHOLIC",
        "CHRISTIAN",
        "HINDU",
        "JEWISH",
        "MUSLIM",
        "SIKH",
        "SPIRITUAL",
        "OTHER",
      ],
      default: "NO PREFERENCE",
    },
  },
  seen: {
    type: [
      {
        user: {
          type: ObjectId,
          ref: "Profile",
        },
        action: {
          type: String,
          enum: ["LIKE", "DISLIKE"],
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  root_user: {
    type: ObjectId,
    ref: "User",
  },
});
const autoPopulateParent = function (next) {
  this.populate([
    {
      path: "location.city",
      model: "City",
    },
    {
      path: "location.district",
      model: "District",
    },
    {
      path: "location.ward",
      model: "Ward",
    },
    {
      path: "homeTown.city",
      model: "City",
    },
    {
      path: "homeTown.district",
      model: "District",
    },
    {
      path: "homeTown.ward",
      model: "Ward",
    },
  ]);
  next();
};
profileSchema
  .pre("find", autoPopulateParent)
  .pre("findOne", autoPopulateParent)
  .pre("findOneAndUpdate", autoPopulateParent);
profileSchema.post("save", function (doc, next) {
  doc
    .populate([
      {
        path: "location.city",
        model: "City",
      },
      {
        path: "location.district",
        model: "District",
      },
      {
        path: "location.ward",
        model: "Ward",
      },
      {
        path: "homeTown.city",
        model: "City",
      },
      {
        path: "homeTown.district",
        model: "District",
      },
      {
        path: "homeTown.ward",
        model: "Ward",
      },
    ])
    .execPopulate()
    .then(function () {
      next();
    });
});
module.exports = (db) => db.model("Profile", profileSchema);
