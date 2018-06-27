const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const AreaGroup = require('./area-group');
const LeadField = require('./lead-field');
const LeadStatus = require('./lead-status');
const AreaGroup = require('./area-group');
const Team = require('./team');

//make singleton
const AccountSchema = new Schema({
    dealerName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    phone: { type: String, required: true, match: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ },
    isActive: { type: Boolean, required: true, default: true },
    teams: [Team.schema],
    areaGroups: [AreaGroup.schema],
    leadFields: [LeadField.schema],
    leadStatuses: [LeadStatus.schema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

AccountSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Account', AccountSchema);