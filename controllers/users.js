const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

//body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding users' });
        
        const safeUsers = [];
        
        users.forEach(user => {
            
            let safeUser = Object.assign({}, user._doc);
            delete safeUser.password;
            safeUsers.push(safeUser);
        });
        
        return res.json({ status: SUCCESS, data: { users: safeUsers } });
    });
});

//create
router.post('/', (req, res) => {
    User.findOne({ $or: [ { username: req.body.username }, { email: req.body.email } ] }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        //existing email or username handled in user schema
        
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
router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (!user) return res.json({ status: ERROR, data: err, code: 404, message: 'User not found' });
        
        const safeUser = Object.assign({}, user._doc);
        
        delete safeUser.password;
        
        return res.json({ status: SUCCESS, data: { user: safeUser } });
    });
});

//update
router.put('/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
        
        //existing email or username handled in user schema
        
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
});


//destroy
router.delete('/:id', (req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting user' });
        
        if (!user) return res.json({ status: ERROR, code: 404, message: 'User not found' });
        
        return res.json({ status: SUCCESS, data: { message: 'User deleted' } });
    });
});

module.exports = router;