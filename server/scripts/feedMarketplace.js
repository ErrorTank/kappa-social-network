const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const dbManager = require('../config/db');
const appDb = dbManager.getConnections()[0];
const Category = require('../db/model/marketplace/category')(appDb);
const Listing = require('../db/model/marketplace/listing')(appDb);

let categories = [
  // parent category
  // {
  //   _id: new ObjectId(),
  //   name: 'Xe cộ',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Nhà & Vườn',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Quần áo & phụ kiện',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Đồ điện tử',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Gia đình',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Rao vặt',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Sở thích',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Giải trí',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Công việc',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Bán nhà',
  //   parent: null,
  //   requiredField: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   name: 'Cho thuê',
  //   parent: null,
  //   requiredField: [],
  // },

  //child category

  {
    _id: new ObjectId(),
    name: 'Xe hơi/Xe tải',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: [
      'vehicleType',
      'year',
      'make',
      'model',
      'bodyType',
      'milage',
    ],
  },
  {
    _id: new ObjectId(),
    name: 'Xe máy',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: ['vehicleType', 'year', 'make', 'model', 'milage'],
  },
  {
    _id: new ObjectId(),
    name: 'Xe mô tô thể thao',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: ['vehicleType', 'year', 'make', 'model', 'price'],
  },
  {
    _id: new ObjectId(),
    name: 'RV/Nhà xe lưu động',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: ['vehicleType', 'year', 'make', 'model', 'price'],
  },
  {
    _id: new ObjectId(),
    name: 'Thuyền',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: ['vehicleType', 'year', 'make', 'model', 'price'],
  },
  {
    _id: new ObjectId(),
    name: 'Xe moóc',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: ['vehicleType', 'year', 'make', 'model', 'price'],
  },
  {
    _id: new ObjectId(),
    name: 'Thương mại/Công nghiệp',
    parent: '5f4934c330b2b231185a53a8',
    requiredField: ['vehicleType', 'year', 'make', 'model', 'price'],
  },
  {
    _id: new ObjectId(),
    name: 'Công cụ',
    parent: '5f4934c330b2b231185a53a9',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
  {
    _id: new ObjectId(),
    name: 'Nội thất',
    parent: '5f4934c330b2b231185a53a9',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
  {
    _id: new ObjectId(),
    name: 'Hộ gia đình',
    parent: '5f4934c330b2b231185a53a9',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
  {
    _id: new ObjectId(),
    name: 'Vườn',
    parent: '5f4934c330b2b231185a53a9',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
  {
    _id: new ObjectId(),
    name: 'Thiết bị',
    parent: '5f4934c330b2b231185a53a9',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
  {
    _id: new ObjectId(),
    name: 'Trò chơi điện tử',
    parent: '5f4934c330b2b231185a53af',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
  {
    _id: new ObjectId(),
    name: 'Sách, phim & nhạc',
    parent: '5f4934c330b2b231185a53af',
    requiredField: ['title', 'price', 'category', 'location', 'availability'],
  },
];

// Category.insertMany(categories)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
// Category.deleteMany({}).then(() => console.log('ok'));

let listing = [
  // {
  //   photo: ['9568.jpg'],
  //   title: 'Xe Honda airblade 2017',
  //   price: 31000000,
  //   category: ObjectId('5f4934c330b2b231185a53a8'),
  // },
  // {
  //   photo: ['9911.jpg'],
  //   title: 'Yamaha Exciter 135-150 2018',
  //   price: 15000000,
  //   category: ObjectId('5f4934c330b2b231185a53a8'),
  // },
];

// Listing.insertMany(listing)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
// Listing.deleteMany({}).then(() => console.log('ok'));
