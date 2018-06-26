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
    phone: { type: String, required: true },
    dealerLogoPath: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    areaGroups: [AreaGroup.schema],
    fields: [Field.schema],
    statuses: [Status.schema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: 'System' },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

AccountSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    next();
});

AccountSchema.setAuthor = function(userId, done) {
    //if (!this.createdBy) this.createdBy = userId;
    this.updatedBy = userId;
    
    done();
};

module.exports = mongoose.model('Account', AccountSchema);