const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const LeadFieldSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true, uniqueCaseInsensitive: true },
    type: { type: String, required: true, enum: ['Text', 'Select', 'Radio', 'Checkbox', 'Date', 'Email', 'Text Area'] },
    options: [String],
    fieldGroup: { type: String },
    order: { type: Number },
    isActive: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

LeadFieldSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

LeadFieldSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exists' });

module.exports = mongoose.model('LeadField', LeadFieldSchema);