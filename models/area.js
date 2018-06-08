const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    title: { type: String, required: true },
    coords: { type: Array, required: true },
    city: { type: String, required: true },
    status: { type: String, default: 'new', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Area', areaSchema);