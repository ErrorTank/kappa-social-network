const feed = require('./feed');

const initDbCollections = (appDb) => {
  const User = require('../db/model/user')(appDb);
  const PersonPost = require('../db/model/person-post')(appDb);
  const PagePost = require('../db/model/page-post')(appDb);
  const PageCategory = require('../db/model/page-category')(appDb);
  const Page = require('../db/model/page')(appDb);
  const GroupPost = require('../db/model/group-post')(appDb);
  const Group = require('../db/model/group')(appDb);
  const ChatRoom = require('../db/model/chat-room')(appDb);
  const ConfirmToken = require('../db/model/confirm-token')(appDb);
  const ResetPasswordToken = require('../db/model/reset-password-token')(appDb);
  const { City, Ward, District } = require('../db/model/location')(appDb);
  const Listing = require('../db/model/marketplace/listing')(appDb);
  const Category = require('../db/model/marketplace/category')(appDb);
  console.log('Initialize Db collections successfully!');
  return feed({
    PageCategory,
    City,
    Ward,
    District,
  });
};

module.exports = initDbCollections;
