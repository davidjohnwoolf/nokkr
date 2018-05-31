const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// index
router.get('/', verifyToken, (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
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
        
        return res.json({ status: SUCCESS, data: { users: safeUsers } });
    });
});

// create
router.post('/', verifyToken, (req, res) => {
    User.findOne({ $or: [{username: req.body.username}, { email: req.body.email }] }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (user && req.body.email === user.email) {
            return res.json({ status: FAIL, data: { message: 'Email already exists' } });
        }
        
        if (user && req.body.username === user.username) {
            return res.json({ status: FAIL, data: { message: 'Username already exists' } });
        }
        
        if (req.body.password === req.body.passwordConfirmation) {
            
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                const user = new User(req.body);
                
                user.save(err => {
                    if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error saving user' });
                    
                    return res.json({
                        status: SUCCESS,
                        data: {
                            message: 'User created'
                        }
                    });
                });
                
            } else {
                
                return res.json({
                    status: FAIL,
                    data: { message: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character' }
                });
            }
            
        } else {
            
            return res.json({
                status: FAIL,
                data: { message: 'Passwords do not match' }
            });
        }
    });
});

// show
router.get('/:id', verifyToken, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (user) {
            return res.json({
                status: SUCCESS,
                data: {
                    user: {
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        createdAt: user.createdAt,
                        id: user._id
                    }
                }
            });
        } else {
            return res.json({
                status: ERROR,
                code: 404,
                message: 'User does not exist'
            });
        }
    });
});

// update
router.put('/:id', verifyToken, (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (user && (user.id !== req.params.id)) {
            
            res.json({ status: FAIL, data: { message: 'Username already exists' } });
        } else {
            
            User.findOne({ _id: req.params.id }, (err, user) => {
                if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
                
                if (!req.body.password || (req.body.password === req.body.passwordConfirmation)) {
                    
                    if (!req.body.password || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
        
                        for (let key in req.body) {
                        	user[key] = req.body[key];
                        }
                        
                        user.save(err => {
                            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error saving user' });
                            
                            return res.json({
                                status: SUCCESS,
                                data: {
                                    message: 'User updated',
                                    user: {
                                        name: user.name,
                                        username: user.username,
                                        email: user.email,
                                        isAdmin: user.isAdmin,
                                        createdAt: user.createdAt,
                                        id: user._id
                                    }
                                }
                            });
                        });
                    
                    } else {
                        
                        return res.json({
                            status: FAIL,
                            data: { message: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character' }
                        });
                    }
                    
                } else {
                    
                    return res.json({ status: FAIL, data: { message: 'Passwords do not match' } });
                }
                
            });
        }
    });
});

// destroy
router.delete('/:id', verifyToken, (req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting user' });
    
    	return res.json({ status: SUCCESS, data: { message: 'User deleted' } });
    });
});

module.exports = router;