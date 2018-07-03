const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const LeadStatusSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true, uniqueCaseInsensitive: true },
    type: { type: String, required: true, enum: ['Uncontacted', 'In Progress', 'Sale', 'No Sale'] },
    color: { type: String, required: true, match: /^#(?:[0-9a-fA-F]{3}){1,2}$/ },
    order: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

LeadStatusSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

LeadStatusSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exists' });

module.exports = mongoose.model('LeadStatus', LeadStatusSchema);