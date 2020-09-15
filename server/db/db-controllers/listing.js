const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Listing = require('../model/marketplace/listing')(appDb);
const Category = require('../model/marketplace/category')(appDb);
const { getRootCategories } = require('./category');

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
  return Category.find({})
    .lean()
    .then((categories) => {
      let listingList = [];
      return Promise.all(
        categories.map((e) => {
          let chilrenArr = getRootCategories(categories, e._id);
          return Listing.find({
            category: {
              $in: chilrenArr.map((e) => ObjectId(e)),
            },
          })
            .lean()
            .sort('-created_at')
            .then((products) => {
              return { _id: e._id, name: e.name, listingArr: [...products] };
            });
        })
      );
    });
};

module.exports = {
  createListing,
  getListing,
};
