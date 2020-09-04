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
      return categories.map((e) => {
        let childrenArr = getRootCategories(categories, e._id);
        //tim ten cac category con voi pipeline - aggruate?
        return {
          ...e,
          children: childrenArr.length > 1 ? childrenArr : [],
        };
      });
      // let id = '5f4934c330b2b231185a53a8';
    });
};

module.exports = {
  getRootCategories,
  getCategories,
};
