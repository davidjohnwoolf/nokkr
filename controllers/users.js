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
router.get('/', requireAdmin, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    //if manager only show own team
    if (loggedInUser.role === MANAGER) {
        User.find({ team: loggedInUser.team }, (err, users) => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding users' });
            
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
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding users' });
            
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
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding user' });

        const newUser = new User(req.body);
        
        newUser.save((err, user) => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.message || 'Error creating user'
                });
            }
            
            return res.json({
                status: SUCCESS,
                data: {
                    message: 'User created',
                    id: user.id
                }
            });
        });
    });
});

//show
router.get('/:id', requireUser, (req, res) => {
    const loggedInUser = req.loggedInUser;
    

    //if admin or su or own user
    if ((loggedInUser.role === ADMIN) || (loggedInUser.role === SU) || (req.params.id === loggedInUser.id)) {

        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, data: err, code: 404, message: 'User not found' });
            
            const safeUser = Object.assign({}, user._doc);
            
            delete safeUser.password;
            
            return res.json({ status: SUCCESS, data: { user: safeUser } });
        });
    } else {
        return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
    }
});

//update
router.put('/:id', requireUser, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    //if admin or su or own user
    if ((loggedInUser.role === ADMIN) || (loggedInUser.role === SU) || (req.params.id === loggedInUser.id)) {
        
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding user' });
            
            if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
            
            for (let key in req.body) {
            	user[key] = req.body[key];
            }
            
            user.save(err => {
                if (err) {
                    return res.json({
                        status: ERROR,
                        data: err,
                        message: err.errors[Object.keys(err.errors)[0]].message || 'Error updating user'
                    });
                }
                
                return res.json({
                    status: SUCCESS,
                    data: {
                        message: 'User updated'
                    }
                });
            });
        });
    } else {
        return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
    }
});


//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error deleting user' });
        
        if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
        
        return res.json({ status: SUCCESS, data: { message: 'User deleted' } });
    });
});

module.exports = router;