const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true },
    notifySales: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

TeamSchema.pre('save', function(next) {
    if (this.isModified()) this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Team', TeamSchema);