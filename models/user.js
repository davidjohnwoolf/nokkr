const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true }, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean
});

userSchema.pre('save', function(next) {
    let user = this;
     
    // check if user password is new or modified
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        
        // hash the password combined with the salt
        bcrypt.hash(user.password, salt, (err, hash) {
            if (err) return next(err);
            
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, done) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return done(err);
        
        done(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);