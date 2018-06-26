const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ['New', 'Contacted', 'Closed', 'No Sale'] },
    color: { type: String, required: true, match: /^#(?:[0-9a-fA-F]{3}){1,2}$/ },
    order: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

StatusSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Status', StatusSchema);