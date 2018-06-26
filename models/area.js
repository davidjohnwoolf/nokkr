const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
    title: { type: String, required: true },
    coords: { type: Array, required: true }, //validation for the google maps coords?
    areaGroup: { type: String, required: true },
    city: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    timesKnocked: { type: Number, default: 1 },
    lastKnocked: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

AreaSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Area', AreaSchema);