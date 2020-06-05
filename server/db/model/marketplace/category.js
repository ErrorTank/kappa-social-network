const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  parent: {
    type: ObjectId,
    ref: 'Category',
    default: null,
  },
  requiredField: {
    type: [
      {
        type: String,
      },
    ],
    default: [],
  },
});

module.exports = (db) => db.model('Category', categorySchema);
