const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/:id/statuses/', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        return res.json({ status: SUCCESS, data: { areas: account.statuses } });
    });
});

//create
router.post('/:id/statuses/', (req, res) => {
    Account.findOne({ _id: req.body.id }, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        if (account.statuses.find(status => status.title === req.body.title)) {
            return res.json({ status: FAIL, data: { message: 'Status title already exists for this account' } });
        }
        
        account.statuses.push(req.body);
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error saving account' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status created' } });
        });
    });
});

//show
router.get('/:id/statuses/:statusId', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        const status = account.statuses.find(status => status.id === req.params.statusId);
        
        if (!status) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding status' });
        
        return res.json({ status: SUCCESS, data: { status } });
    });
});

//update
router.put('/:id/statuses/:statusId', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        for (let key in req.body) {
        	account[key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating status' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status updated' } });
        });
    });
});

//destroy
router.delete('/:id/statuses/:statusId', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	const statusIndex = account.statuses.findIndex(status => status.id === req.params.id);
    	
    	account.statuses[statusIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting status' });
            
            return res.json({ status: SUCCESS, data: { message: 'Status deleted' } });
        });
    });
});

module.exports = router;