const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  // needed information
  photo: [String],
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
  //optional
  decription: {
    type: String,
  },
  location: {
    type: String,
  },
  availability: {
    type: String,
    enum: ['single', 'instock', 'soldout'],
  },
  offerDelivery: {
    type: Boolean,
  },
  amount: Number,
  comment: {
    type: [
      {
        rating: {
          type: Number,
          enum: [0, 1, 2, 3, 4, 5],
          default: 0,
        },
        author: {
          type: ObjectId,
          ref: 'User',
        },
        postTime: {
          type: Date,
          default: Date.now,
        },
        title: String,
        content: String,
        picture: [String],
      },
    ],
  },
  productTag: String,
  // Home & Garden
  condition: {
    type: String,
    enum: ['new', 'like new', 'good', 'fair'],
  },
  brand: {
    type: String,
  },
  material: {
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
  carrier: {
    type: String,
  },
  deviceName: {
    type: String,
  },
  //Hobbies
  //Classifieds
  //Vehicle
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
  //Home for Rent
  rentalType: {
    type: String,
  },
  numberOfBedrooms: {
    type: String,
  },
  pricePerMonth: {
    type: String,
  },
  rentalAddress: {
    type: String,
  },
  rentalDescription: {
    type: String,
  },
  //Home - Advenced Details
  squareFeet: {
    type: String,
  },
  dateAvailable: {
    type: Date,
  },
  laundryType: {
    type: String,
  },
  parkingType: {
    type: String,
  },
  airConditioningType: {
    type: String,
  },
  heatingType: {
    type: String,
  },
  catFriendly: {
    type: Boolean,
  },
  dogFriendly: {
    type: Boolean,
  },
});

module.exports = (db) => db.model('Listing', listingSchema);
