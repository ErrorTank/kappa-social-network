const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const locationSchema = new Schema({
    foo: String,
    bar: String
}, {strict: false});




module.exports = db => ({
    City: db.model("City", locationSchema),
    District: db.model("District", locationSchema),
    Ward: db.model("Ward", locationSchema),
});