const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
    User.findOne({ $or: [{username: req.body.username}, { email: req.body.email }] }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (!user) {
            return res.json({ status: FAIL, data: { message: 'Username or password is incorrect' } });
        } else {
            
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error authenticating credentials' });
                
                if (isMatch) {
                    
                    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        // expires in 24 hours
                        expiresIn: 30
                    });
                    
                    res.json({ status: SUCCESS, data: { token } });
                }
                
                if (!isMatch) {
                    res.json({ status: FAIL, data: { message: 'Username or password is incorrect' } });
                }
            });
            
        }
    });
});

module.exports = router;