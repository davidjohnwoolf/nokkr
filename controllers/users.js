const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

//status variables for Jsend API spec, password regex and role constants
const { SUCCESS, FAIL, ERROR, PW_REGEX, USER, MANAGER, ADMIN, SU } = require('../lib/constants');

const { requireAdmin, requireManager, requireUser, excludeReadOnly } = require('./helpers/authorization');

//body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', requireManager, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    //if manager only show own team
    if (loggedInUser.role === MANAGER) {
        User.find({ team: loggedInUser.team }, (err, users) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding users' });
            
            //to store users after removing the password hash
            const safeUsers = [];
            
            users.forEach(user => {
                
                let safeUser = Object.assign({}, user._doc);
                delete safeUser.password;
                
                safeUsers.push(safeUser);
            });
            
            return res.json({ status: SUCCESS, data: { users: safeUsers } });
        });
        
    //if above manager show all
    } else {
        User.find({}, (err, users) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding users' });
            
            //to store users after removing the password hash
            const safeUsers = [];
            
            users.forEach(user => {
                
                let safeUser = Object.assign({}, user._doc);
                delete safeUser.password;
                
                safeUsers.push(safeUser);
            });
            
            return res.json({ status: SUCCESS, data: { users: safeUsers } });
        });
    }
});

//create
router.post('/', requireAdmin, excludeReadOnly, (req, res) => {
    User.findOne({ $or: [ { username: req.body.username }, { email: req.body.email } ] }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (user && user.username === req.body.username) {
            return res.json({ status: FAIL, data: { message: 'Username already exists' } });
        }
        
        if (user && user.email === req.body.email) {
            return res.json({ status: FAIL, data: { message: 'Email already exists' } });
        }
        
        if (req.body.password !== req.body.passwordConfirmation) {
            return res.json({
                status: FAIL,
                data: { message: 'Passwords do not match' }
            });
        }
        
        if (!PW_REGEX.test(req.body.password)) {
            return res.json({
                status: FAIL,
                data: { message: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character' }
            });
        }

        const newUser = new User(req.body);
        
        newUser.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error creating user' });
            
            return res.json({
                status: SUCCESS,
                data: {
                    message: 'User created'
                }
            });
        });
    });
});

//show
router.get('/:id', requireUser, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    //if admin or su show any user
    if (loggedInUser.role === ADMIN || loggedInUser.role === SU) {
        
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, data: err, code: 404, message: 'User not found' });
            
            if (user.team !== loggedInUser.team) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }
            
            const safeUser = Object.assign({}, user._doc);
            
            delete safeUser.password;
            
            return res.json({ status: SUCCESS, data: { user: safeUser } });
        });
    
    //if manager only show user from own team
    } else if (loggedInUser.role === MANAGER) {
        
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, data: err, code: 404, message: 'User not found' });
            
            //must request user first to find out the users team
            if (user.team !== loggedInUser.team) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }
            
            const safeUser = Object.assign({}, user._doc);
            
            delete safeUser.password;
            
            return res.json({ status: SUCCESS, data: { user: safeUser } });
        });
        
    //if not manager, admin or su only show own user page
    } else {
        
        if (req.params.id !== loggedInUser.id) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
            
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, data: err, code: 404, message: 'User not found' });
            
            if (user.team !== loggedInUser.team) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }
            
            const safeUser = Object.assign({}, user._doc);
            
            delete safeUser.password;
            
            return res.json({ status: SUCCESS, data: { user: safeUser } });
        });
    }
});

//update
router.put('/:id', requireUser, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    //if admin or su show any user
    if (loggedInUser.role === ADMIN || loggedInUser.role === SU) {
        
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
            
            if (req.body.password !== req.body.passwordConfirmation) {
                return res.json({
                    status: FAIL,
                    data: { message: 'Passwords do not match' }
                });
            }
            
            if (PW_REGEX.test(req.body.password)) {
                return res.json({
                    status: FAIL,
                    data: { message: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character' }
                });
            }
            
            for (let key in req.body) {
            	user[key] = req.body[key];
            }
            
            user.save(err => {
                if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating user' });
                
                return res.json({
                    status: SUCCESS,
                    data: {
                        message: 'User created'
                    }
                });
            });
        });
        
    } else {
        //if manager or regular user, only show if own user
        if (req.params.id !== loggedInUser.id) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
            
            if (req.body.password !== req.body.passwordConfirmation) {
                return res.json({
                    status: FAIL,
                    data: { message: 'Passwords do not match' }
                });
            }
            
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                return res.json({
                    status: FAIL,
                    data: { message: 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character' }
                });
            }
            
            for (let key in req.body) {
            	user[key] = req.body[key];
            }
            
            user.save(err => {
                if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating user' });
                
                return res.json({
                    status: SUCCESS,
                    data: {
                        message: 'User created'
                    }
                });
            });
        });
    }
});


//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting user' });
        
        if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
        
        return res.json({ status: SUCCESS, data: { message: 'User deleted' } });
    });
});

module.exports = router;