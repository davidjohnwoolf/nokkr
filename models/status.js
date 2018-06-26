const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    order: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Status', StatusSchema);