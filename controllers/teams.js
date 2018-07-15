const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const Team = require('../models/team');
const User = require('../models/user');

//status variables for Jsend API spec and su role
const { SUCCESS, FAIL, ERROR, MANAGER } = require('../lib/constants');

const { requireAdmin, requireManager, excludeReadOnly } = require('./helpers/authorization');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', requireAdmin, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        let teams = [];

        account.teams.forEach(c => {
            let team = Object.assign({}, c._doc);
            teams.push(team);
        });
        
        return res.json({ status: SUCCESS, data: { payload: teams } });
    });
});

//create
router.post('/', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        account.teams.push(new Team(req.body));
        
        account.save((err, account) => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.errors[Object.keys(err.errors)[0]].message || 'Error creating team'
                });
            }
            
            return res.json({ status: SUCCESS, data: { message: 'Team created', payload: account.teams.find(team => team.title === req.body.title).id } });
        });
    });
});

//show
router.get('/:id', requireManager, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    if ((loggedInUser.role === MANAGER) && (loggedInUser.team !== req.params.id)) {
        return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
    }
    
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        const team = account.teams.find(team => team.id === req.params.id);
        
        if (!team) return res.json({ status: ERROR, code: 404, message: 'Team not found' });
        
        return res.json({ status: SUCCESS, data: { payload: team } });
    });
});

//update
router.put('/:id', requireManager, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    if ((loggedInUser.role === MANAGER) && (loggedInUser.team !== req.params.id)) {
        return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
    }
    
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const teamIndex = account.teams.findIndex(team => team.id === req.params.id);
        
        if (teamIndex < 0) return res.json({ status: ERROR, code: 404, message: 'Team not found' });
        
        for (let key in req.body) {
        	account.teams[teamIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.errors[Object.keys(err.errors)[0]].message || 'Error updating team'
                });
            }
            
            return res.json({ status: SUCCESS, data: { message: 'Team updated' } });
        });
    });
});

//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const teamIndex = account.teams.findIndex(team => team.id === req.params.id);
    	
    	if (teamIndex < 0) return res.json({ status: ERROR, code: 404, message: 'Team not found' });
    	
    	User.find({ team: req.params.id }, (err, users) => {
    	    if (err) return res.json({ status: ERROR, data: err, message: 'Error finding users' });
    	    
    	    if (users.length) {
    	        return res.json({ status: ERROR, data: err, message: 'Cannot delete team with users' });
    	    }
    	    
    	    account.teams[teamIndex].remove();
    	
        	account.save(err => {
                if (err) return res.json({ status: ERROR, data: err, message: 'Error deleting team' });
                
                return res.json({ status: SUCCESS, data: { message: 'Team deleted' } });
            });
        
    	});
    });
});

module.exports = router;