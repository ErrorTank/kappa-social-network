const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  // needed information
  photo: {
    type: String,
  },
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
  },
  category: {
    type: ObjectId,
    ref: 'categories',
    default: null,
  },
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
