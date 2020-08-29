const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Listing = require('../model/marketplace/listing')(appDb);
const Category = require('../model/marketplace/category')(appDb);

const createListing = (value) => {
  // return new Listing(value).save().then((newListing) => {
  //   return newListing;
  // });
  // console.log(value.category);
  Category.find({ name: value.category }).then((category) => {
    let newListing = {
      ...value,
      category: category._id,
    };
    console.log(newListing);
  });
  // return value;
};

module.exports = {
  createListing,
};
