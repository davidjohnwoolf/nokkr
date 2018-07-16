const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true, sparse: true },
    coords: { type: Array, required: true }, //validation for the google maps coords?
    areaGroup: { type: Schema.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
    timesKnocked: { type: Number, default: 0 },
    lastKnocked: { type: Date }, //is updated when lead is created in it
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

AreaSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Area', AreaSchema);