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
router.get('/:id/fields/', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        return res.json({ field: SUCCESS, data: { areas: account.fields } });
    });
});

//create
router.post('/:id/fields/', (req, res) => {
    Account.findOne({ _id: req.body.id }, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, data: err, code: 404, message: 'Account not found' });
        
        if (account.fields.find(field => field.title === req.body.title)) {
            return res.json({ field: FAIL, data: { message: 'Status title already exists for this account' } });
        }
        
        account.fields.push(req.body);
        
        account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error saving account' });
            
            return res.json({ field: SUCCESS, data: { message: 'Status created' } });
        });
    });
});

//show
router.get('/:id/fields/:fieldId', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, data: err, code: 404, message: 'Account not found' });
        
        const field = account.fields.find(field => field.id === req.params.fieldId);
        
        if (!field) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding field' });
        
        return res.json({ field: SUCCESS, data: { field } });
    });
});

//update
router.put('/:id/fields/:fieldId', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        for (let key in req.body) {
        	account[key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error updating field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Field updated' } });
        });
    });
});

//destroy
router.delete('/:id/fields/:fieldId', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, account) => {
    	if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	const fieldIndex = account.fields.findIndex(field => field.id === req.params.id);
    	
    	account.fields[fieldIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error deleting field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Field deleted' } });
        });
    });
});

module.exports = router;