const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomField = require('./custom-field.js');

//add file path available in custom fields, notes
const CustomFieldSchema = new Schema({
    leadFieldId: { type: Schema.Types.ObjectId, required: true },
    value: { type: String, required: true },
});

module.exports = mongoose.model('CustomField', CustomFieldSchema);