const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const Status = require('../models/status');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        return res.json({ status: SUCCESS, data: { areas: account.statuses } });
    });
});

//create
router.post('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        if (account.statuses.find(status => status.title === req.body.title)) {
            return res.json({ status: FAIL, data: { message: 'Status already exists' } });
        }
        
        account.statuses.push(new Status(req.body));
        
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
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        const status = account.statuses.find(status => status.id === req.params.id);
        
        if (!status) return res.json({ status: ERROR, data: err, code: 404, message: 'Status not found' });
        
        return res.json({ status: SUCCESS, data: { status } });
    });
});

//update
router.put('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        const statusIndex = account.statuses.findIndex(status => status.id === req.params.id);
        
        if (!statusIndex) return res.json({ status: ERROR, data: err, code: 404, message: 'Status not found' });
        
        for (let key in req.body) {
        	account.statuses[statusIndex][key] = req.body[key];
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
    	
    	const statusIndex = account.statuses.findIndex(status => status.id === req.params.id);
    	
    	if (!statusIndex) return res.json({ status: ERROR, data: err, code: 404, message: 'Status not found' });
    	
    	account.statuses[statusIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting status' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status deleted' } });
        });
    });
});

module.exports = router;