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
  console.log(categoryName);
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
    'Cho thuê': `${value.homeType} cho thuê`,
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
const getListingByListingID = (listingID) => {
  return Listing.findOne({ _id: listingID })
    .populate(
      'user category'
      // '_id basic_info avatar bio joined_at'
    )
    .lean()
    .then((listing) => {
      return listing;
    });
};
const updateListing = (data) => {
  let categoryName = findSubCategory(data);
  return Category.findOne({ name: categoryName }).then((category) => {
    let updateListing = {
      ...data,
      category: category._id,
    };
    return Listing.findOneAndUpdate(
      {
        _id: ObjectId(data._id),
      },
      updateListing,
      {
        new: true,
      }
    )
      .lean()
      .then((listing) => {
        return listing;
      });
  });
};
const deleteListing = ({ listingID }) => {
  return Listing.findOneAndDelete({
    _id: ObjectId(listingID),
  })
    .lean()
    .exec();
};

const saveListing = ({ userID, saveListingConfig, listingID }) => {
  // console.log(saveListingConfig);
  let { on, off } = saveListingConfig;
  let execCommand;
  if (on) {
    execCommand = {
      $push: {
        savedUser: ObjectId(userID),
      },
    };
  }
  if (off) {
    execCommand = {
      $pull: {
        savedUser: ObjectId(userID),
      },
    };
  }
  return Listing.findOneAndUpdate(
    {
      _id: ObjectId(listingID),
    },
    execCommand,
    { new: true }
  )
    .populate('user category')
    .lean();
};
const updateStock = ({ listingConfig, listingID }) => {
  let { on, off } = listingConfig;
  let execCommand;
  if (on) {
    execCommand = {
      $set: {
        isStocked: true,
      },
    };
  }
  if (off) {
    execCommand = {
      $set: {
        isStocked: false,
      },
    };
  }
  return Listing.findOneAndUpdate(
    {
      _id: ObjectId(listingID),
    },
    execCommand,
    { new: true }
  )
    .populate('user category')
    .lean();
};

const getSavedListing = (userID) => {
  return Listing.find({ savedUser: userID })
    .populate('user category')
    .lean()
    .then((e) => {
      return e;
    });
};
module.exports = {
  createListing,
  getListing,
  getListingByCategoryID,
  getListingByUserID,
  getListingByListingID,
  updateListing,
  deleteListing,
  saveListing,
  getSavedListing,
  updateStock,
};
