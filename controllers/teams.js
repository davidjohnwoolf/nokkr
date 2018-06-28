const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const Team = require('../models/team');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = require('./helpers/api-variables');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        return res.json({ status: SUCCESS, data: { areas: account.teams } });
    });
});

//create
router.post('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        //move to schema validator
        if (account.teams.find(team => team.title === req.body.title)) {
            return res.json({ status: FAIL, data: { message: 'Team already exists' } });
        }
        
        account.teams.push(new Team(req.body));
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error creating team' });
            
            return res.json({ status: SUCCESS, data: { message: 'Team created' } });
        });
    });
});

//show
router.get('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        const team = account.teams.find(team => team.id === req.params.id);
        
        if (!team) return res.json({ status: ERROR, code: 404, message: 'Team not found' });
        
        return res.json({ status: SUCCESS, data: { team } });
    });
});

//update
router.put('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const teamIndex = account.teams.findIndex(team => team.id === req.params.id);
        
        if (!teamIndex) return res.json({ status: ERROR, code: 404, message: 'Team not found' });
        
        for (let key in req.body) {
        	account.teams[teamIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating team' });
            
            return res.json({ status: SUCCESS, data: { message: 'Team updated' } });
        });
    });
});

//destroy
router.delete('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const teamIndex = account.teams.findIndex(team => team.id === req.params.id);
    	
    	if (!teamIndex) return res.json({ status: ERROR, code: 404, message: 'Team not found' });
    	
    	account.teams[teamIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting team' });
            
            return res.json({ status: SUCCESS, data: { message: 'Team deleted' } });
        });
    });
});

module.exports = router;