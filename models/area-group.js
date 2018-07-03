const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const AreaGroupSchema = new Schema({
    title: { type: String, required: true, index: true, unique: true, uniqueCaseInsensitive: true },
    color: { type: String, required: true, match: /^#(?:[0-9a-fA-F]{3}){1,2}$/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

AreaGroupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

AreaGroupSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exists' });

module.exports = mongoose.model('AreaGroup', AreaGroupSchema);