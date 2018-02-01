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
        
        if (user) return res.json({ error: 'Username exists' });
        
        if (req.body.password === req.body.passwordConfirmation) {
            const user = new User(req.body);
            
            user.save(err => {
                if (err) return res.json(err);
                
                return res.json({ message: 'User created', user });
            });
            
        } else {
            
            return res.json({ error: 'Passwords do not match' });
        }
    });
});

// show
router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json(err);
        
        res.json(user);
    });
});

// update
router.put('/:id', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.json(err);
        
        if (user && user._id != req.params.id) {
            
            res.json({ error: 'Username already exists' });
        } else {
            
            User.findOne({ _id: req.params.id }, (err, user) => {
                if (err) return res.json(err);
                
                if (!req.body.password || (req.body.password === req.body.passwordConfirmation)) {
        
                    for (let key in req.body) {
                    	user[key] = req.body[key];
                    }
                    
                    user.save(err => {
                        if (err) return res.json(err);
                        
                        return res.json({ message: 'User updated', user });
                    });
                    
                } else {
                    
                    return res.json({ error: 'Passwords do not match' });
                }
                
            });
        }
    });
});

// destroy
router.delete('/:id', (req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
    	if (err) return res.json(err);
    
    	res.json({ message: 'User deleted' });
    });
});

module.exports = router;