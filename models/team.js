const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const TeamSchema = new Schema({
    title: { type: String, required: true },
    notifySales: { type: Boolean, default: false },
    users: [User.schema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

TeamSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Team', TeamSchema);