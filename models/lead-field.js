const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadFieldSchema = new Schema({
    label: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['Text', 'Select', 'Checkbox', 'Date', 'Email', 'Text Area'] },
    options: [String],
    order: { type: Number },
    isActive: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

LeadFieldSchema.pre('save', function(next) {
    if (this.isModified()) this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('LeadField', LeadFieldSchema);