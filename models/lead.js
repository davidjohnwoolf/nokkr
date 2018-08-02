const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const CustomField = require('./custom-field.js');

//add file path available in custom fields, notes
const LeadSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String }, //enum states
    zipcode: { type: String }, //length validation
    email: { type: String }, //email validation
    primaryPhone: { type: String }, //phone validation
    secondaryPhone: { type: String }, //phone validation
    areaId: { type: Schema.Types.ObjectId },
    //customFields: [Schema.Types.Mixed],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

LeadSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Lead', LeadSchema);