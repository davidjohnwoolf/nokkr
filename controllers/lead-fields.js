const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const LeadField = require('../models/lead-field');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = require('../lib/constants');

const { requireAdmin, excludeReadOnly } = require('./helpers/authorization');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', requireAdmin, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        return res.json({ field: SUCCESS, data: { areas: account.leadFields } });
    });
});

//create
router.post('/', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, code: 404, message: 'Account not found' });
        
        if (account.leadFields.find(leadField => leadField.title === req.body.title)) {
            return res.json({ field: FAIL, data: { message: 'Lead field already exists' } });
        }
        
        account.leadFields.push(new LeadField(req.body));
        
        account.save(err => {
            if (err) return res.json({ field: ERROR, code: 500, message: 'Error creating field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Lead field created' } });
        });
    });
});

//show
router.get('/:id', requireAdmin, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, code: 404, message: 'Account not found' });
        
        const leadField = account.leadFields.find(leadField => leadField.id === req.params.id);
        
        if (!leadField) return res.json({ field: ERROR, code: 404, message: 'Lead field not found' });
        
        return res.json({ field: SUCCESS, data: { leadField } });
    });
});

//update
router.put('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const leadFieldIndex = account.leadFields.findIndex(leadField => leadField.id === req.params.id);
        
        if (!leadFieldIndex) return res.json({ status: ERROR, code: 404, message: 'Lead field not found' });
        
        for (let key in req.body) {
        	account.leadFields[leadFieldIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error updating field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Lead field updated' } });
        });
    });
});

//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const leadFieldIndex = account.leadFields.findIndex(leadField => leadField.id === req.params.id);
    	
    	if (!leadFieldIndex) return res.json({ status: ERROR, code: 404, message: 'Lead field not found' });
    	
    	account.leadFields[leadFieldIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, code: 500, message: 'Error deleting field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Lead field deleted' } });
        });
    });
});

module.exports = router;