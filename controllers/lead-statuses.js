const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const LeadStatus = require('../models/lead-status');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = './helpers/api-variables';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        return res.json({ status: SUCCESS, data: { areas: account.leadStatuses } });
    });
});

//create
router.post('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        if (account.leadStatuses.find(leadStatus => leadStatus.title === req.body.title)) {
            return res.json({ status: FAIL, data: { message: 'Status already exists' } });
        }
        
        account.leadStatuses.push(new LeadStatus(req.body));
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error saving account' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status created' } });
        });
    });
});

//show
router.get('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const leadStatus = account.leadStatuses.find(leadStatus => leadStatus.id === req.params.id);
        
        if (!leadStatus) return res.json({ status: ERROR, code: 404, message: 'Status not found' });
        
        return res.json({ status: SUCCESS, data: { leadStatus } });
    });
});

//update
router.put('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const leadStatusIndex = account.leadStatuses.findIndex(leadStatus => leadStatus.id === req.params.id);
        
        if (!leadStatusIndex) return res.json({ status: ERROR, code: 404, message: 'Status not found' });
        
        for (let key in req.body) {
        	account.leadStatuses[leadStatusIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating status' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status updated' } });
        });
    });
});

//destroy
router.delete('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const leadStatusIndex = account.leadStatuses.findIndex(leadStatus => leadStatus.id === req.params.id);
    	
    	if (!leadStatusIndex) return res.json({ status: ERROR, code: 404, message: 'Status not found' });
    	
    	account.leadStatuses[leadStatusIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting status' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status deleted' } });
        });
    });
});

module.exports = router;