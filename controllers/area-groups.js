const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const AreaGroup = require('../models/area-group');

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
        
        return res.json({ status: SUCCESS, data: { areas: account.areaGroups } });
    });
});

//create
router.post('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        if (account.areaGroups.find(areaGroup => areaGroup.title === req.body.title)) {
            return res.json({ status: FAIL, data: { message: 'Area group already exists' } });
        }
        
        account.areaGroups.push(new AreaGroup(req.body));
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, code: 500, message: 'Error creating area group' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area group created' } });
        });
    });
});

//show
router.get('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const areaGroup = account.areaGroups.find(areaGroup => areaGroup.id === req.params.id);
        
        if (!areaGroup) return res.json({ status: ERROR, code: 404, message: 'Area group not found' });
        
        return res.json({ status: SUCCESS, data: { areaGroup } });
    });
});

//update
router.put('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        const areaGroupIndex = account.areaGroups.findIndex(areaGroup => areaGroup.id === req.params.id);
        
        if (!areaGroupIndex) return res.json({ status: ERROR, code: 404, message: 'Area group not found' });
        
        for (let key in req.body) {
        	account.areaGroups[areaGroupIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating area group' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area group updated' } });
        });
    });
});

//destroy
router.delete('/:id', (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
    	
    	const areaGroupIndex = account.areaGroups.findIndex(areaGroup => areaGroup.id === req.params.id);
    	
    	if (!areaGroupIndex) return res.json({ status: ERROR, code: 404, message: 'Area group not found' });
    	
    	account.areaGroups[areaGroupIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting area group' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area group deleted' } });
        });
    });
});

module.exports = router;