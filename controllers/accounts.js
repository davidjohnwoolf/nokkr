const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = require('../lib/constants');

const { requireAdmin, excludeReadOnly } = require('./helpers/authorization');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//show
router.get('/', requireAdmin, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        return res.json({ status: SUCCESS, data: { payload: account } });
    });
});

//update
router.put('/', requireAdmin, excludeReadOnly, (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, code: 404, message: 'Account not found' });
        
        for (let key in req.body) {
        	account[key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error updating account' });
            
            return res.json({ status: SUCCESS, data: { message: 'Account updated' } });
        });
    });
});

module.exports = router;