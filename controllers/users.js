const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

//const isAuthorized = require('../helpers/auth.helper.js');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// index
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.json(err);
        
        const safeUsers = [];
        
        users.forEach(function(c) {
            safeUsers.push({
                isAdmin: c.isAdmin,
                createdAt: c.createdAt,
                id: c._id,
                name: c.name,
                username: c.username,
            });
        });
        
        return res.json(safeUsers);
    });
});

// create
router.post('/', (req, res) => {
    User.findOne({ $or: [{username: req.body.username}, { email: req.body.email }] }, (err, user) => {
        if (err) return res.json(err);
        
        if (user && req.body.email === user.email) {
            return res.json({ error: 'Email already exists' });
        }
        
        if (user && req.body.username === user.username) {
            return res.json({ error: 'Username already exists' });
        }
        
        if (req.body.password === req.body.passwordConfirmation) {
            
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                const user = new User(req.body);
                
                user.save(err => {
                    if (err) return res.json(err);
                    
                    return res.json({
                        message: 'User created',
                        user: {
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            isAdmin: user.isAdmin,
                            createdAt: user.createdAt,
                            id: user._id
                        }
                    });
                });
                
            } else {
                
                return res.json({
                    error: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
                });
            }
            
        } else {
            
            return res.json({
                error: 'Passwords do not match'
            });
        }
    });
});

// show
router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json(err);
        
        res.json({
            name: user.name,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            id: user._id
        });
    });
});

// update
router.put('/:id', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.json(err);
        
        if (user && (user.id !== req.params.id)) {
            
            res.json({ error: 'Username already exists' });
        } else {
            
            User.findOne({ _id: req.params.id }, (err, user) => {
                if (err) return res.json(err);
                
                if (!req.body.password || (req.body.password === req.body.passwordConfirmation)) {
                    
                    if (!req.body.password || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
        
                        for (let key in req.body) {
                        	user[key] = req.body[key];
                        }
                        
                        user.save(err => {
                            if (err) return res.json(err);
                            
                            return res.json({
                                message: 'User updated',
                                user: {
                                    name: user.name,
                                    username: user.username,
                                    email: user.email,
                                    isAdmin: user.isAdmin,
                                    createdAt: user.createdAt,
                                    id: user._id
                                }
                            });
                        });
                    
                    } else {
                        
                        return res.json({
                            error: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
                        });
                    }
                    
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