const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    title: { type: String, required: true },
    areaCoords: { type: Array, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Area', areaSchema);