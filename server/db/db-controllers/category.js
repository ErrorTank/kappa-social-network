const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Category = require('../model/marketplace/category')(appDb);

const getRootCategories = (query) => {
  let categories = Category.find({}).lean();
  return categories;
};

module.exports = {
  getRootCategories,
};
