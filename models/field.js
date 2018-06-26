const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ['Text', 'Select', 'Radio', 'Checkbox', 'Date', 'Email', 'Text Area'] },
    options: [String],
    fieldGroup: { type: String },
    order: { type: Number },
    isActive: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

FieldSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Field', FieldSchema);