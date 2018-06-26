const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Team = require('../models/team');
const User = require('../models/user');

//const verifyToken = require('./helpers/authorization');

//============
//use JWT payload instead of req.params.teamId and just ignore the team part of the url?
//============

//add email doesnt exist for user update

//add route for index all

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

//const TEAM_USERS_PATH = '/teams/:teamId/users/';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// index all (should we even have, or just let admin browse by team?)
/*router.get('/', (req, res) => {
    Team.find({}, (err, teams) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding teams' });
        
        const safeUsers = [];
        
        teams.forEach(team => {
            team.users.forEach(user => {
                
                let safeUser = Object.assign({}, user._doc);
                delete safeUser.password;
                safeUsers.push(safeUser);
            });
        });
        
        return res.json({ status: SUCCESS, data: { users: safeUsers } });
    });
});*/

// index
router.get('/', (req, res) => {
    Team.findOne({ _id: req.params.teamId }, (err, team) => {
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
    Team.find({}, (err, teams) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding teams' });
        
        const team = teams.find(team => team.id === req.params.teamId);
        
        if (!team) return res.json({ status: ERROR, data: err, code: 404, message: 'Team not found' });
        
        teams.forEach(team => {
        
            team.users.forEach(user => {
                if (user.email === req.body.email) {
                    return res.json({ status: FAIL, data: { message: 'Email already exists' } });
                }
                if (user.username === req.body.username) {
                    return res.json({ status: FAIL, data: { message: 'Username already exists' } });
                }
            });
        });
        
        if (req.body.password === req.body.passwordConfirmation) {
            
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                
                team.users.push(new User(req.body));
                
                team.save(err => {
                    if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error creating user' });
                    
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
router.get('/:id', (req, res) => {
    Team.findOne({ _id: req.params.teamId }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        const user = team.users.find(user => user.id === req.params.id);
        
        if (!user) return res.json({ status: ERROR, data: err, code: 404, message: 'User not found' });
        
        let safeUser = Object.assign({}, user._doc);
        
        delete safeUser.password;
        
        return res.json({ status: SUCCESS, data: { user: safeUser } });
    });
});

// update
router.put('/:id', (req, res) => {
    Team.find({}, (err, teams) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding teams' });
        
        const userId = req.params.id;
        
        const team = teams.find(team => team.id === req.params.teamId);
        
        teams.forEach(team => {
        
            team.users.forEach(user => {
                if ((userId != user.id) && (user.email === req.body.email)) {
                    return res.json({ status: FAIL, data: { message: 'Email already exists' } });
                }
                if ((userId != user.id) && (user.username === req.body.username)) {
                    return res.json({ status: FAIL, data: { message: 'Username already exists' } });
                }
            });
        });

        if (!req.body.password || (req.body.password === req.body.passwordConfirmation)) {
            
            if (!req.body.password || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(req.body.password)) {
                
                const userIndex = team.users.findIndex(user => user.id === userId);
    
                for (let key in req.body) {
                	team.users[userIndex][key] = req.body[key];
                }
                
                team.save(err => {
                    if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating user' });
                    
                    return res.json({
                        status: SUCCESS,
                        data: {
                            message: 'User updated'
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
});

// destroy
router.delete('/:id', (req, res) => {
    Team.findOne({ _id: req.params.teamId }, (err, team) => {
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