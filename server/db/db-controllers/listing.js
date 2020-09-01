const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Listing = require('../model/marketplace/listing')(appDb);
const Category = require('../model/marketplace/category')(appDb);

const createListing = (value) => {
  return Category.findOne({ name: value.category }).then((category) => {
    let newListing = {
      ...value,
      category: category._id,
    };
    return new Listing(newListing).save().then((newListing) => {
      return newListing;
    });
  });
};

const getListing = (query) => {
  return Listing.find({}).then((listingArr) => {
    return listingArr;
  });
};

module.exports = {
  createListing,
  getListing,
};
