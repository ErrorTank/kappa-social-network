const feed = require('./feed');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const initDbCollections = (appDb) => {
  const User = require('../db/model/user')(appDb);
  const PageCategory = require('../db/model/page-category')(appDb);
  const Page = require('../db/model/page')(appDb);
  const Group = require('../db/model/group')(appDb);
  const Post = require('../db/model/post')(appDb);
  const ChatRoom = require('../db/model/chat-room')(appDb);
  const ConfirmToken = require('../db/model/confirm-token')(appDb);
  const ResetPasswordToken = require('../db/model/reset-password-token')(appDb);
  const { City, Ward, District } = require('../db/model/location')(appDb);
  const Listing = require('../db/model/marketplace/listing')(appDb);
  const Category = require('../db/model/marketplace/category')(appDb);
  const Comment = require('../db/model/comment')(appDb);
  const Profile = require('../db/model/dating/profile')(appDb);
  const Mapping = require('../db/model/dating/mapping')(appDb);
  const ChatBox = require('../db/model/dating/chatbox')(appDb);
  const Match = require('../db/model/dating/match')(appDb);
  // Profile.findOneAndUpdate(
  //   {
  //     _id: ObjectId('5f6c7d338e8e3639300b0207'),
  //   },
  //   {
  //     $set: {
  //       seen: [],
  //     },
  //   }
  // ).exec();
  // Profile.updateMany(
  //   {},
  //   {
  //     $set: {
  //       seen: [],
  //     },
  //   }
  // ).exec();
  // Comment.updateMany({}, {$set: {replies: []}}).then(() => console.log("cac"))
  // ChatRoom.deleteMany({}).then(() => console.log("cac"))
  // User.updateMany({}, {$set: {"contact.address": {ward: ObjectId("5e92c7b6b4c8182784f5bcff"), city: ObjectId("5e92c7b4b4c8182784f59d4a"), district: ObjectId("5e92c7b4b4c8182784f5994b")}}}).then(() => console.log("cac"))
  // User.updateMany({}, {$set: {followed_posts: []}}).then(() => console.log("cac"))
  // User.updateMany({}, {$set: {favorites: []}}).then(() => console.log("cac"))
  // User.updateMany({}, {$set: {notifications: []}}).then(() => console.log("cac"))
  // Post.updateMany({}, {$set: {belonged_wall: null}}).then(() => console.log("cac"))
  // Post.deleteMany({}).then(() => console.log("cac"))
  // User.findOneAndUpdate({"contact.login_username.email": "ncq998@gmail.com"}, {$set: {"user_about_privacy.relationship": "PUBLIC"}}, {new: true}).then((user) => console.log(user))
  // User.findOneAndUpdate({_id: ObjectId("5eccd70efc70863c7c5f9e0c")}, {$set: {"basic_info.dob": new Date(new Date().getTime() + 86400000)}}).then(() => console.log("cac"))
  console.log('Initialize Db collections successfully!');
  return feed({
    PageCategory,
    City,
    Ward,
    District,
    Mapping,
  });
};

module.exports = initDbCollections;
