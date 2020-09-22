const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Category = require('../model/marketplace/category')(appDb);

const getRootCategories = (categories, mainCategoryID) => {
  let recusiveFind = (categoryID) => {
    let data = categories.filter((e) =>
      e.parent ? e.parent.toString() === categoryID.toString() : false
    );
    if (!data.length) {
      return [categoryID];
    }
    let result = data.map((each) => {
      return recusiveFind(each._id);
    });
    return result.reduce((arr, cur) => [...arr, ...cur], []);
  };
  return recusiveFind(mainCategoryID);
};

const getCategories = (query) => {
  const { categoryName } = query;
  return Category.find({})
    .lean()
    .then((categories) => {
      return Promise.all(
        categories.map((e) => {
          let childrenArr = getRootCategories(categories, e._id);
          if (childrenArr.length > 1) {
            return Category.find({
              _id: {
                $in: childrenArr.map((e) => ObjectId(e)),
              },
            })
              .lean()
              .then((childrenCategory) => {
                return { ...e, children: childrenCategory };
              });
          } else {
            return Promise.resolve({
              ...e,
              children: [],
            });
          }
        })
      );
    });
};

module.exports = {
  getRootCategories,
  getCategories,
};
