const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const teamSchema = new Schema({
    title: { type: String, required: true },
    teamLogo: { type: String },
    notifySales: { type: Boolean, default: false },
    users: [User.schema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Team', teamSchema);