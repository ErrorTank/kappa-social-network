const feed = require('./feed');

const initDbCollections = (appDb) => {
  const User = require('../db/model/user')(appDb);
  const PageCategory = require('../db/model/page-category')(appDb);
  const Page = require('../db/model/page')(appDb);
  const Group = require('../db/model/group')(appDb);
  const Comment = require('../db/model/comment')(appDb);
  const ChatRoom = require('../db/model/chat-room')(appDb);
  const ConfirmToken = require('../db/model/confirm-token')(appDb);
  const ResetPasswordToken = require('../db/model/reset-password-token')(appDb);
  const { City, Ward, District } = require('../db/model/location')(appDb);
  const Listing = require('../db/model/marketplace/listing')(appDb);
  const Category = require('../db/model/marketplace/category')(appDb);
  // ChatRoom.deleteMany({}).then(() => console.log("cac"))
  console.log('Initialize Db collections successfully!');
  return feed({
    PageCategory,
    City,
    Ward,
    District,
  });
};

module.exports = initDbCollections;
