const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomField = require('./custom-field.js');

//add file path available in custom fields, notes
const CustomFieldSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true }, //enum types
    value: { type: String },
    fieldGroupId: { type: Schema.Types.ObjectId },
});

module.exports = mongoose.model('CustomField', CustomFieldSchema);