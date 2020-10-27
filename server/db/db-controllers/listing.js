const dbManager = require('../../config/db');
const { insideCircle } = require('geolocation-utils');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Listing = require('../model/marketplace/listing')(appDb);
const Category = require('../model/marketplace/category')(appDb);
const { getRootCategories, getCategoryByID } = require('./category');

const createListing = (value) => {
  let categoryName = findSubCategory(value);
  return Category.findOne({ name: categoryName }).then((category) => {
    let newListing = {
      ...value,
      category: category._id,
    };
    return new Listing(newListing).save().then((newListing) => {
      return newListing;
    });
  });
};

const findSubCategory = (value) => {
  const { category } = value;
  const subCategoryName = {
    'Xe hơi/Xe tải': value.bodyType,
    'Cho thuê': value.homeType,
  };
  return subCategoryName[category] ? subCategoryName[category] : category;
};

const getListing = (query) => {
  let { lat, lon, radius } = query;
  return Category.find({})
    .lean()
    .then((categories) => {
      return Promise.all(
        categories.map((e) => {
          let chilrenArr = getRootCategories(categories, e._id);
          return Listing.find({
            category: {
              $in: chilrenArr.map((e) => ObjectId(e)),
            },
          })
            .lean()
            .sort('-postTime')
            .then((products) => {
              let radiusByMeter = parseInt(radius) * 1000;
              let productsInRadius = products.filter((e) =>
                insideCircle(
                  e.position,
                  { lat: Number(lat), lon: Number(lon) },
                  radiusByMeter
                )
              );
              return {
                _id: e._id,
                name: e.name,
                listingArr: [...productsInRadius],
              };
            });
        })
      );
    });
};

const getListingByCategoryID = (userID) => {
  return Category.find({})
    .lean()
    .then((categories) => {
      return getCategoryByID(userID).then((categoryInfo) => {
        let chilrenArr = getRootCategories(categories, userID);
        return Listing.find({
          category: {
            $in: chilrenArr.map((e) => ObjectId(e)),
          },
        })
          .lean()
          .sort('-postTime')
          .then((products) => {
            return {
              _id: categoryInfo._id,
              name: categoryInfo.name,
              listingArr: [...products],
            };
          });
      });
    });
};
// multi-select: ctrl + shift + l
const getListingByUserID = (userID) => {
  return Listing.find({ user: userID })
    .lean()
    .then((listing) => {
      return listing;
    });
};
module.exports = {
  createListing,
  getListing,
  getListingByCategoryID,
  getListingByUserID,
};
