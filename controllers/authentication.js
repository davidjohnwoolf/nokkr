const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
    User.findOne({ $or: [{username: req.body.username}, { email: req.body.email }] }, (err, user) => {
        if (err) return res.json(err);
        
        if (!user) {
            return res.json({ error: 'Username or password is incorrect' });
        } else {
            
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) return res.json(err);
                
                if (isMatch) {
                    
                    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        // expires in 24 hours
                        expiresIn: 86400
                    });
                    
                    res.json({ token: token });
                }
                
                if (!isMatch) {
                    res.json({ error: 'Username or password is incorrect' });
                }
            });
            
        }
    });
});

module.exports = router;