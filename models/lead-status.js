const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadStatusSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true },
    type: { type: String, required: true, enum: ['Uncontacted', 'Contacted', 'Qualified', 'Sold', 'No Sale'] },
    color: { type: String, required: true, match: /^#(?:[0-9a-fA-F]{3}){1,2}$/ },
    order: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

LeadStatusSchema.pre('save', function(next) {
    if (this.isModified()) this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('LeadStatus', LeadStatusSchema);