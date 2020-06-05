const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const Category = require('../db/model/marketplace/category')(appDb);

let categories = [
  {
    _id: new ObjectId(),
    name: 'Xe cộ',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Nhà và Vườn',
    parent: null,
    requiredField: ['condition', 'brand'],
  },
  {
    _id: new ObjectId(),
    name: 'Quần áo và phụ kiện',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Đồ điện tử',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Gia đình',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Rao vặt',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Sở thích',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Giải trí',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Công việc',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  {
    _id: new ObjectId(),
    name: 'Bán nhà',
    parent: null,
    requiredField: ['vehicleType', 'year', 'make', 'model'],
  },
  //more
  // {
  //   _id: new ObjectId(),
  //   name: 'Tài sản cho thuê',
  //   parent: null,
  //   requiredField: ['vehicleType', 'year', 'make', 'model'],
  // },
];

// Category.insertMany(categories)
//   .then(data => console.log(data))
//   .catch(err => console.log(err));
