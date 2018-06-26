const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    options: { type: Array },
    fieldGroup: { type: String },
    order: { type: String },
    isActive: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Field', FieldSchema);