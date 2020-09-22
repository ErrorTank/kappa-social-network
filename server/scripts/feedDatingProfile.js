const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const dbManager = require("../config/db");
const appDb = dbManager.getConnections()[0];
const Profile = require("../db/model/dating/profile")(appDb);

// let profile = [
//   {
//     _id: new ObjectId(),
//     name: "Minh Thu",
//     avatars: [
//       "https://192.168.100.9:2000/assets/images/MinhThu/minhthu1.jpg",
//       "",
//     ],
//   },
// ];
