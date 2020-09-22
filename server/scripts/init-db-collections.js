const feed = require('./feed');

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
  // Comment.updateMany({}, {$set: {replies: []}}).then(() => console.log("cac"))
  // ChatRoom.deleteMany({}).then(() => console.log("cac"))
  // User.updateMany({}, {$set: {followed_posts: []}}).then(() => console.log("cac"))
  // Post.updateMany({}, {$set: {belonged_wall: null}}).then(() => console.log("cac"))
  // Post.deleteMany({}).then(() => console.log("cac"))
  console.log('Initialize Db collections successfully!');
  return feed({
    PageCategory,
    City,
    Ward,
    District,
    Mapping
  });
};

module.exports = initDbCollections;
