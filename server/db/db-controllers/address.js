const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { City, District, Ward } = require('../model/location')(appDb);

const getAddress = (query) => {
  const { cityCode, districtCode } = query;
  if (!cityCode && !districtCode) return City.find({}).lean();
  if (cityCode && !districtCode) {
    return District.find({ parent_code: cityCode }).lean();
  }
  if (!cityCode && districtCode) {
    return Ward.find({ parent_code: districtCode }).lean();
  }
  return Promise.reject();
};

module.exports = {
  getAddress,
};
