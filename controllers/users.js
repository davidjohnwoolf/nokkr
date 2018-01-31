const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// index
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.json(err);
        
        return res.json(users);
    });
});

// create
router.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.json(err);
        
        if (user) return res.json({ errorMessage: 'Username exists' });
        
        if (req.body.password === req.body.passwordConfirmation) {
            const user = new User(req.body);
            
            user.save((err) => {
                if (err) return res.json(err);
                
                return res.json({ successMessage: 'User created successfully' });
            });
            
        } else {
            return res.json({ errorMessage: 'Passwords do not match' });
        }
    });
});

module.exports = router;