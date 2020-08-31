const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  // must
  files: {
    default: [],
    type: [
      {
        path: String,
        name: String,
        origin_path: String,
      },
    ],
  },
  postTime: Date,
  position: {
    lat: Number,
    lon: Number,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  //
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    default: null,
  },
  condition: {
    type: String,
    enum: [
      'Mới',
      'Đã qua sử dụng - Như mới',
      'Đã qua sử dụng - Tốt',
      'Đã qua sử dụng - Khá Tốt',
    ],
  },
  //optional
  decription: {
    type: String,
  },
  location: {
    type: String,
  },
  availability: {
    type: String,
    enum: [
      'Niêm yết là chỉ còn 1 mặt hàng',
      'Niêm yết là còn hàng',
      'Niêm yết là hết hàng',
    ],
  },

  //need to add later
  offerDelivery: {
    type: Boolean,
  },
  amount: Number,
  // comment: {
  //   type: [
  //     {
  //       rating: {
  //         type: Number,
  //         enum: [0, 1, 2, 3, 4, 5],
  //         default: 0,
  //       },
  //       author: {
  //         type: ObjectId,
  //         ref: 'User',
  //       },
  //       postTime: {
  //         type: Date,
  //         default: Date.now,
  //       },
  //       title: String,
  //       content: String,
  //       picture: [String],
  //     },
  //   ],
  // },
  // productTag: [String],
  //

  // Home & Garden
  brand: {
    type: String,
  },
  material: {
    type: String,
  },
  color: {
    type: String,
  },
  //Entertainment
  platform: {
    type: String,
  },
  //Clothing & Accessories
  size: {
    type: String,
  },
  //Family
  //Electronics
  carrie: {
    type: String,
  },
  deviceName: {
    type: String,
  },
  //Hobbies
  //Classifieds

  //Vehicle
  vehicleIdentificationNumber: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  year: {
    type: Number,
  },
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  bodyType: {
    type: String,
  },
  mileage: {
    type: String,
  },
  tranmission: {
    type: String,
  },
  fuelType: {
    type: String,
  },
  vehicleCondition: {
    type: String,
  },

  //Home for Rent
  homeFor: {
    type: String,
  },
  homeType: {
    type: String,
  },
  numberOfBedrooms: {
    type: String,
  },
  numberOfBathrooms: {
    type: String,
  },
  pricePerMonth: {
    type: Number,
  },
  address: {
    type: String,
  },

  //don't know yet

  //Home - Advenced Details
  // squareFeet: {
  //   type: String,
  // },
  // dateAvailable: {
  //   type: Date,
  // },
  // laundryType: {
  //   type: String,
  // },
  // parkingType: {
  //   type: String,
  // },
  // airConditioningType: {
  //   type: String,
  // },
  // heatingType: {
  //   type: String,
  // },
  // catFriendly: {
  //   type: Boolean,
  // },
  // dogFriendly: {
  //   type: Boolean,
  // },
});

module.exports = (db) => db.model('Listing', listingSchema);
