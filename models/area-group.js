const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaGroupSchema = new Schema({
    title: { type: String, required: true },
    color: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

module.exports = mongoose.model('AreaGroup', AreaGroupSchema);