const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Category = require('../model/marketplace/category')(appDb);

const getRootCategories = (categories, mainCategoryID) => {
  // let categories = Category.find({}).lean();
  let recusiveFind = (categoryID) => {
    // categories.map((e) => {
    //   console.log(e.parent);
    // });
    let data = categories.filter((e) =>
      e.parent ? e.parent.toString() === categoryID : false
    );
    if (!data.length) {
      return [categoryID];
    }
    let result = data.map((each) => {
      return recusiveFind(each._id.toString());
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
      // let id = '5f49371859bac41b24d97fce';
      let id = '5f4934c330b2b231185a53a8';
      return getRootCategories(categories, id);
    });

  // if (!categoryName) {
  //   return categories.map(e => {
  //     return getRootCategories(categories, e._id);
  //   })
  // }
};

module.exports = {
  getRootCategories,
  getCategories,
};
