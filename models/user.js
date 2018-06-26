const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const Area = require('./area');

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    email: {
        type: String,
        required: true,
        index: { unique: true },
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/
    },
    userImage: { type: String },
    isAdmin: { type: Boolean, default: false },
    isManager: { type: Boolean, default: false },
    isReadOnly: { type: Boolean, default: false },
    areas: [Area.schema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String }
});

UserSchema.pre('save', function(next) {
    const user = this;
    
    // check if user password is new or modified
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        
        // hash the password combined with the salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, done) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return done(err);
        
        done(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);