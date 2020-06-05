const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const dbManager = require('../config/db');
const appDb = dbManager.getConnections()[0];
const Category = require('../db/model/marketplace/category')(appDb);
const Listing = require('../db/model/marketplace/listing')(appDb);

// let categories = [
//   {
//     _id: new ObjectId(),
//     name: 'Xe cộ',
//     parent: null,
//     requiredField: ['vehicleType', 'year', 'make', 'model'],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Nhà và Vườn',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Quần áo và phụ kiện',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Đồ điện tử',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Gia đình',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Rao vặt',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Sở thích',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Giải trí',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Công việc',
//     parent: null,
//     requiredField: [],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Bán nhà',
//     parent: null,
//     requiredField: [],
//   },

// {
//     _id: new ObjectId(),
//     name: 'Ô tô',
//     parent: '5eda0ee20a5fb321e86e952a',
//     requiredField: ['vehicleType', 'year', 'make', 'model'],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Xe tải',
//     parent: '5eda0ee20a5fb321e86e952a',
//     requiredField: ['vehicleType', 'year', 'make', 'model'],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Xe phân khối lớn',
//     parent: '5eda0ee20a5fb321e86e952a',
//     requiredField: ['vehicleType', 'year', 'make', 'model'],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Xe mô tô',
//     parent: '5eda0ee20a5fb321e86e952a',
//     requiredField: ['vehicleType', 'year', 'make', 'model'],
//   },
//   {
//     _id: new ObjectId(),
//     name: 'Tàu thuyền',
//     parent: '5eda0ee20a5fb321e86e952a',
//     requiredField: ['vehicleType', 'year', 'make', 'model'],
//   },
// ];

// let categories = [];

// Category.insertMany(categories)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
// Category.deleteMany({}).then(() => console.log('ok'));

let listing = [
  // {
  //   photo: ['9568.jpg'],
  //   title: 'Xe Honda airblade 2017',
  //   price: 31000000,
  //   category: ObjectId('5eda0ee20a5fb321e86e952a'),
  // },

  {
    photo: ['9911.jpg'],
    title: 'Yamaha Exciter 135-150 2018',
    price: 15000000,
    category: ObjectId('5eda0ee20a5fb321e86e952a'),
  },
];

// Listing.insertMany(listing)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
// Listing.deleteMany({}).then(() => console.log('ok'));
