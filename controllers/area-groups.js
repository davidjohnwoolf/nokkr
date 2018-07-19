const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');
const AreaGroup = require('../models/area-group');
const User = require('../models/user');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = require('../lib/constants');

const { requireManager, excludeReadOnly } = require('./helpers/authorization');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', requireManager, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const areaGroups = [];
        
        account.areaGroups.forEach(c => {
            let areaGroup = Object.assign({}, c._doc);
            areaGroups.push(areaGroup);
        });
        
        return res.json({ status: SUCCESS, data: { payload: areaGroups } });
    });
});

//create
router.post('/', requireManager, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        account.areaGroups.push(new AreaGroup(req.body));
        
        account.save(err => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.errors[Object.keys(err.errors)[0]].message || 'Error creating area group'
                });
            }
            
            return res.json({
                status: SUCCESS,
                data: {
                    message: 'Area group created',
                    payload: account.areaGroups.find(areaGroup => areaGroup.title === req.body.title).id
                }
            });
        });
    });
});

//show
router.get('/:id', requireManager, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const areaGroup = account.areaGroups.find(areaGroup => areaGroup.id === req.params.id);
        
        if (!areaGroup) return res.json({ status: ERROR, code: 404, message: 'Area group not found' });
        
        User.find({}, (err, users) => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding users' });
            
            const areas = [];
            let user;
            
            users.forEach(user => {
                user.areas.forEach(area => {
                    if (area.areaGroup == req.params.id) {
                        areas.push(Object.assign({
                            assignedUserName: user.firstName + ' ' + user.lastName,
                        }, area._doc));
                    }
                })
            });
            
            return res.json({ status: SUCCESS, data: { payload: Object.assign({ areas }, areaGroup._doc) } });
        });
        
    });
});

//update
router.put('/:id', requireManager, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        const areaGroupIndex = account.areaGroups.findIndex(areaGroup => areaGroup.id === req.params.id);
        
        if (areaGroupIndex < 0) return res.json({ status: ERROR, code: 404, message: 'Area group not found' });
        
        for (let key in req.body) {
        	account.areaGroups[areaGroupIndex][key] = req.body[key];
        }
        
        account.save(err => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.errors[Object.keys(err.errors)[0]].message || 'Error updating area group'
                });
            }
            
            return res.json({ status: SUCCESS, data: { message: 'Area group updated' } });
        });
    });
});

//destroy
router.delete('/:id', requireManager, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
    	if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
    	
    	if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
    	
    	const areaGroupIndex = account.areaGroups.findIndex(areaGroup => areaGroup.id === req.params.id);
    	
    	if (areaGroupIndex < 0) return res.json({ status: ERROR, code: 404, message: 'Area group not found' });
    	
    	account.areaGroups[areaGroupIndex].remove();
    	
    	account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error deleting area group' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area group deleted' } });
        });
    });
});

module.exports = router;