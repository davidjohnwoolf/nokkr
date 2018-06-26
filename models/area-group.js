const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaGroupSchema = new Schema({
    title: { type: String, required: true },
    color: { type: String, required: true, match: /^#(?:[0-9a-fA-F]{3}){1,2}$/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

AreaGroupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('AreaGroup', AreaGroupSchema);