const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    tile: { type: String, required: true },
    areaCoords: { type: Array, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Area', areaSchema);