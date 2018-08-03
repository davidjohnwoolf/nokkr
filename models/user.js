const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const Area = require('./area');
const Lead = require('./lead');

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/
    },
    teamId: { type: Schema.Types.ObjectId },
    //userImage: { data: Buffer, contentType: String },
    role: { type: String, required: true, enum: ['user', 'manager', 'admin', 'su'], default: 'user'},
    isReadOnly: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    areas: [Area.schema],
    leads: [Lead.schema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

UserSchema.pre('save', function(next) {
    const user = this;
    
    user.updatedAt = Date.now();
    
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