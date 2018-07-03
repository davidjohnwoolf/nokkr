const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const TeamSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true, uniqueCaseInsensitive: true },
    notifySales: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

TeamSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

TeamSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exists' });

module.exports = mongoose.model('Team', TeamSchema);