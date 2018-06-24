const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaGroup = require('./area-group');
const Field = require('./field');
const Status = require('./status');

//make singleton
const accountSchema = new Schema({
    dealerName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    dealerLogo: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    areaGroups: [AreaGroup.schema],
    fields: [Field.schema],
    statuses: [Status.schema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: 'System' },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Account', accountSchema);