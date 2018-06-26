const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Team = require('../models/team');
const User = require('../models/user');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// index
router.get('/', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        const safeUsers = [];
        
        team.users.forEach(user => {
            
            let safeUser = Object.assign({}, user._doc);
            delete safeUser.password;
            safeUsers.push(safeUser);
        });
        
        return res.json({ status: SUCCESS, data: { users: safeUsers } });
    });
});

// create
router.post('/', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        team.users.forEach(user => {
            if (user.email === req.body.email) {
                return res.json({ status: FAIL, data: { message: 'Email already exists' } });
            }
            if (user.username === req.body.username) {
                return res.json({ status: FAIL, data: { message: 'Username already exists' } });
            }
        });
        
        if (req.body.password === req.body.passwordConfirmation) {
            
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                
                team.users.push(new User(req.body));
                
                return res.json({
                    status: SUCCESS,
                    data: {
                        message: 'User created'
                    }
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
router.get('/:userId', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        const user = team.users.find(user => user._id === req.params.userId);
        
        let safeUser = Object.assign({}, user._doc);
        
        delete safeUser.password;
        
        if (user) {
            return res.json({
                status: SUCCESS,
                data: { user: safeUser }
            });
        } else {
            return res.json({
                status: ERROR,
                code: 404,
                message: 'User not found'
            });
        }
    });
});

// update
router.put('/:userId', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        const user = team.users.find(user => user._id === req.params.userId);
        
        if (user && team.users.find(user => user.username === req.body.username)) {
            
            res.json({ status: FAIL, data: { message: 'Username already exists' } });
            
        } else {

            if (!req.body.password || (req.body.password === req.body.passwordConfirmation)) {
                
                if (!req.body.password || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                    
                    const userIndex = team.users.findIndex(user => user._id === req.params.userId);
        
                    for (let key in req.body) {
                    	team.users[userIndex][key] = req.body[key];
                    }
                    
                    const user = team.users[userIndex];
                    
                    team.save(err => {
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
                
        }
    });
});

// destroy
router.delete('/:userId', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        const userIndex = team.users.findIndex(user => user._id === req.params.userId);
        
        if (userIndex) {
            team.users.splice(userIndex);
            
            team.save(err => {
                if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting user' });
                
                return res.json({ status: SUCCESS, data: { message: 'User deleted' } });
            });
    	    
        } else {
            return res.json({ status: ERROR, code: 404, data: { message: 'User not found' } });
        }
    });
});

module.exports = router;