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
        if (err) return res.json({ field: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        return res.json({ field: SUCCESS, data: { payload: account.leadFields.sort((a, b) => a.order - b.order) } });
    });
});

//create
router.post('/', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, code: 404, message: 'Account not found' });
        
        let fieldWithOrder = account.leadFields.find(leadStatus => req.body.order == leadStatus.order);
        
        if (fieldWithOrder) {
            account.leadFields.forEach((field, i) => {
                if (field.order >= req.body.order) account.leadFields[i].order += 1;
            });
        }
        
        account.leadFields.push(new LeadField(req.body));
        
        account.save(err => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.errors[Object.keys(err.errors)[0]].message || 'Error creating field'
                });
            }
            
            return res.json({ field: SUCCESS, data: { message: 'Lead field created' } });
        });
    });
});

//show
router.get('/:id', requireAdmin, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ field: ERROR, code: 404, message: 'Account not found' });
        
        const leadField = account.leadFields.find(leadField => leadField.id === req.params.id);
        
        if (!leadField) return res.json({ field: ERROR, code: 404, message: 'Lead field not found' });
        
        return res.json({ field: SUCCESS, data: { payload: leadField } });
    });
});

//update
router.put('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ field: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const leadFieldIndex = account.leadFields.findIndex(leadField => leadField.id === req.params.id);
        
        if (leadFieldIndex < 0) return res.json({ status: ERROR, code: 404, message: 'Lead field not found' });
        
        let fieldWithOrderIndex = account.leadFields.findIndex(field => ((req.body.title !== field.title) && (req.body.order == field.order)));
        
        if (fieldWithOrderIndex) {
            if (req.body.order > account.leadFields[leadFieldIndex].order) {
                account.leadFields.forEach((field, i) => {
                    if (
                        (field.order > account.leadStatuses[leadFieldIndex].order)
                        && (field.order <= req.body.order)
                        && (field.id != req.params.id)
                    ) {
                        account.leadFields[i].order = account.leadFields[i].order - 1;
                    }
                });
            } else {
                account.leadFields.forEach((field, i) => {
                    if (
                        (field.order < account.leadFields[leadFieldIndex].order)
                        && (field.order >= req.body.order)
                        && (field.id != req.params.id)
                    ) {
                        account.leadFields[i].order += 1;
                    }
                });
            }
        }
        
        for (let key in req.body) {
        	account.leadFields[leadFieldIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.errors[Object.keys(err.errors)[0]].message || 'Error updating field'
                });
            }
            
            return res.json({ field: SUCCESS, data: { message: 'Lead field updated' } });
        });
    });
});

//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ field: ERROR, data: err, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const leadFieldIndex = account.leadFields.findIndex(leadField => leadField.id === req.params.id);
    	
    	if (leadFieldIndex < 0) return res.json({ status: ERROR, code: 404, message: 'Lead field not found' });
    	
    	account.leadFields[leadFieldIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ field: ERROR, data: err, message: 'Error deleting field' });
            
            return res.json({ field: SUCCESS, data: { message: 'Lead field deleted' } });
        });
    });
});

module.exports = router;