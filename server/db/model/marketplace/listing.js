const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  // needed information
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
});

module.exports = (db) => db.model('Listing', listingSchema);
