const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const AreaGroup = require('./area-group');
const Field = require('./field');
const Status = require('./status');
const AreaGroup = require('./area-group');

//make singleton
const AccountSchema = new Schema({
    dealerName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    phone: { type: String, required: true, match: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ },
    isActive: { type: Boolean, required: true, default: true },
    areaGroups: [AreaGroup.schema],
    fields: [Field.schema],
    statuses: [Status.schema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

AccountSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Account', AccountSchema);