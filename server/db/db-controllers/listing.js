const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Listing = require('../model/marketplace/listing')(appDb);

const createListing = (value) => {
  // return new Listing(value).save().then((newListing) => {
  //   return newListing;
  // });
  console.log(value);
  return value;
};

module.exports = {
  createListing,
};
