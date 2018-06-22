const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaGroup = require('./area-group');
const Field = require('./field');
const Status = require('./Status');

const accountSchema = new Schema({
    dealerName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    logoPath: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    areaGroups: [AreaGroup.schema],
    fields: [Field.schema],
    statuses: [Status.schema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: 'System' },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

//make singleton

module.exports = mongoose.model('Account', accountSchema);