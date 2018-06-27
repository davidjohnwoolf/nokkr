const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const Field = require('../models/field');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = './helpers/api-variables';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        return res.json({ field: SUCCESS, data: { areas: account.fields } });
    });
});

//create
router.post('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, code: 404, message: 'Account not found' });
        
        if (account.fields.find(field => field.title === req.body.title)) {
            return res.json({ field: FAIL, data: { message: 'Field already exists' } });
        }
        
        account.fields.push(new Field(req.body));
        
        account.save(err => {
            if (err) return res.json({ field: ERROR, code: 500, message: 'Error creating field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Field created' } });
        });
    });
});

//show
router.get('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, code: 404, message: 'Account not found' });
        
        const field = account.fields.find(field => field.id === req.params.id);
        
        if (!field) return res.json({ field: ERROR, code: 404, message: 'Field not found' });
        
        return res.json({ field: SUCCESS, data: { field } });
    });
});

//update
router.put('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const fieldIndex = account.fields.findIndex(field => field.id === req.params.id);
        
        if (!fieldIndex) return res.json({ status: ERROR, code: 404, message: 'Field not found' });
        
        for (let key in req.body) {
        	account.fields[fieldIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error updating field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Field updated' } });
        });
    });
});

//destroy
router.delete('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const fieldIndex = account.fields.findIndex(field => field.id === req.params.id);
    	
    	if (!fieldIndex) return res.json({ status: ERROR, code: 404, message: 'Field not found' });
    	
    	account.fields[fieldIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error deleting field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Field deleted' } });
        });
    });
});

module.exports = router;